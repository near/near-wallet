import BN from 'bn.js';
import cloneDeep from 'lodash.clonedeep';
import { utils, transactions as transaction } from 'near-api-js';
import { handleActions } from 'redux-actions';

import { calculateGasLimit, increaseGasForTransactions, handleSignTransactions, RETRY_TX_GAS, SIGN_STATUS } from '../../slices/sign';

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
    [handleSignTransactions.pending]: (state) => {
        const { status } = state;

        const transactions = status === SIGN_STATUS.RETRY_TRANSACTION
            ? increaseGasForTransactions({ transactions: cloneDeep(state.transactions) })
            : state.transactions;

        return {
            ...state,
            status: SIGN_STATUS.IN_PROGRESS,
            transactions,
            fees: {
                ...state.transactions.fees,
                gasLimit: calculateGasLimit(transactions.flatMap(t => t.actions))
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

        const hasAtLeastOneFunctionCallAction = state.transactions.some((t) => {
            return (t.actions || []).some((a) => a && a.functionCall);
        });
        
        const canRetryWithIncreasedGas = notEnoughGasAttached && hasAtLeastOneFunctionCallAction && state.transactions.some((t) => {
            if (!t.actions) { return false; }
    
            return t.actions.some((a) => {
                // We can only increase gas for actions that are function calls and still have < RETRY_TX.GAS.MAX gas allocated
                if (!a || !a.functionCall) { return false; }
    
                return a.functionCall.gas.lt(new BN(RETRY_TX_GAS.MAX));
            });
        });

        return {
            ...state,
            status: canRetryWithIncreasedGas
                ? SIGN_STATUS.RETRY_TRANSACTION
                : SIGN_STATUS.ERROR,
            error,
            retryTx: notEnoughGasAttached
        };
    },
    [makeAccountActive]: () => {
        return initialState;
    }
}, initialState);

export default sign;
