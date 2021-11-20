import BN from 'bn.js';
import { utils, transactions as transaction } from 'near-api-js';
import { handleActions } from 'redux-actions';

import { parseTransactionsToSign, makeAccountActive } from '../../actions/account';
import { calculateGasLimit, increaseGasForFirstTransaction, handleSignTransactions, SIGN_STATUS, removeSuccessTransactions, updateSuccessHashes, checkAbleToIncreaseGas, getFirstTransactionWithFunctionCallAction, calculateGasForSuccessTransactions } from '../../slices/sign';

const initialState = {
    status: SIGN_STATUS.NEEDS_CONFIRMATION
};

const deserializeTransactionsFromString = (transactionsString) => transactionsString.split(',')
    .map(str => Buffer.from(str, 'base64'))
    .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer));

const sign = handleActions({
    [parseTransactionsToSign]: (state, { payload: { transactions: transactionsString, callbackUrl, meta } }) => {
        const transactions = deserializeTransactionsFromString(transactionsString);

        const allActions = transactions.flatMap(t => t.actions);
        
        return {
            status: SIGN_STATUS.NEEDS_CONFIRMATION,
            callbackUrl,
            meta,
            transactions,
            totalAmount: allActions
                .map(a => (a.transfer && a.transfer.deposit) || (a.functionCall && a.functionCall.deposit) || 0)
                .reduce((totalAmount, amount) => totalAmount.add(new BN(amount)), new BN(0)).toString(),
            fees: {
                transactionFees: '', // TODO: Calculate total fees
                gasLimit: calculateGasLimit(allActions),
                gasPrice: '' // TODO: Where to get gas price?
            },
            sensitiveActionsCounter: allActions
                .filter(a => ['deployContract', 'stake', 'deleteAccount'].indexOf(Object.keys(a)[0]) > -1)
                .length
        };
    },
    [updateSuccessHashes]: (state, { payload }) => ({
        ...state,
        successHashes: [
            ...(state.successHashes || []),
            ...payload
        ]
    }),
    [handleSignTransactions.pending]: (state) => {
        const { status, transactions } = state;

        let retryTransactions;
        // prepare retryTransactions array that will be copy of the transactions - this object will be used for modifications
        if (status === SIGN_STATUS.RETRY_TRANSACTION) {
            // if this is the first attempt of retry, we want to use oryginal transactions array
            retryTransactions = state.retryTransactions || state.transactions;
            // increase gas for retryTransactions array
            retryTransactions = increaseGasForFirstTransaction({ transactions: retryTransactions });
        }

        return {
            ...state,
            status: SIGN_STATUS.IN_PROGRESS,
            retryTransactions,
            fees: {
                ...state.transactions.fees,
                gasLimit: calculateGasLimit((retryTransactions || transactions).flatMap(t => t.actions))
            }
        };
    },
    [handleSignTransactions.fulfilled]: (state, { payload }) => ({
        ...state,
        status: SIGN_STATUS.SUCCESS,
        transactionHashes: payload,
        error: undefined
    }),
    [handleSignTransactions.rejected]: (state, { error }) => {
        const notEnoughGasAttached = error.message.includes('Exceeded the prepaid gas');

        // if this is the first error, we want to use oryginal transactions array because retryTransactions doesn't exists yet
        const transactions = state.retryTransactions || state.transactions;
        // we want to calculate the gas that was set for successfull transactions, so we will be able to show the prediction of the gas usage in the UI
        const gasUsed = calculateGasForSuccessTransactions({ transactions: transactions, successHashes: state.successHashes });
        // remove transactions that succedeed, so it will no be sign again
        const retryTransactions = removeSuccessTransactions({ transactions, successHashes: state.successHashes });

        const hasAtLeastOneFunctionCallAction = retryTransactions.some((t) => {
            return (t.actions || []).some((a) => a && a.functionCall);
        });

        // If there are multiple tx, we want to check for the first tx with functionCall action, because it's possible that increasing gas for the other transactions will end with exceeded gas
        const transaction = getFirstTransactionWithFunctionCallAction({ transactions: retryTransactions});
        
        const canRetryWithIncreasedGas = notEnoughGasAttached && hasAtLeastOneFunctionCallAction && transaction && checkAbleToIncreaseGas({ transaction });
        return {
            ...state,
            retryTransactions,
            gasUsed: new BN(state.gasUsed || '0').add(new BN(gasUsed || '0')),
            status: canRetryWithIncreasedGas
                ? SIGN_STATUS.RETRY_TRANSACTION
                : SIGN_STATUS.ERROR,
            error
        };
    },
    [makeAccountActive]: () => {
        return initialState;
    }
}, initialState);

export default sign;
