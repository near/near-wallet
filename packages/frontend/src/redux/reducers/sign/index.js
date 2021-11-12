import BN from 'bn.js';
import cloneDeep from 'lodash.cloneDeep';
import { utils, transactions as transaction } from 'near-api-js';
import { handleActions } from 'redux-actions';

import { calculateGasLimit, increaseGasForTransactions, handleSignTransactions, RETRY_TX, SIGN_STATUS } from '../../slices/sign';

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
        const { retryTxDirection, status } = state;

        const transactions = status === SIGN_STATUS.RETRY_TRANSACTION
            ? increaseGasForTransactions({ 
                transactions: cloneDeep(state.transactions),
                retryTxDirection: state.retryTxDirection || retryTxDirection }
            )
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
        const retryTxDirection = error.message.includes('Exceeded the prepaid gas')
            ? RETRY_TX.INCREASE
            : undefined;
        
        const tryRetryTx = retryTxDirection && !state.transactions.every((t) => 
            t.actions && t.actions.every((a) => a.functionCall && a.functionCall.gas && (
                state.retryTxDirection === RETRY_TX.INCREASE 
                && (
                    a.functionCall.gas.gt(new BN(RETRY_TX.GAS.MAX))
                    || a.functionCall.gas.eq(new BN(RETRY_TX.GAS.MAX))
                )
            ))
        );
        
        return {
            ...state,
            status: tryRetryTx
                ? SIGN_STATUS.RETRY_TRANSACTION
                : SIGN_STATUS.ERROR,
            error,
            retryTxDirection: state.retryTxDirection || retryTxDirection
        };
    },
    [makeAccountActive]: () => {
        return initialState;
    }
}, initialState);

export default sign;