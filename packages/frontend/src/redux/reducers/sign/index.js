import BN from 'bn.js';
import cloneDeep from 'lodash.cloneDeep';
import { utils, transactions as transaction } from 'near-api-js';
import { handleActions } from 'redux-actions';

import { Mixpanel } from "../../../mixpanel";
import { parseTransactionsToSign, makeAccountActive } from '../../actions/account';
import { handleSignTransactions, SIGN_STATUS } from '../../slices/sign';

const RETRY_TX = {
    INCREASE: 'increase',
    DECREASE: 'decrease',
    GAS: {
        DIFF: '25000000000000',
        MAX: '300000000000000',
        MIN: '150000000000000'
    }
};

const initialState = {
    status: SIGN_STATUS.NEEDS_CONFIRMATION
};

const deserializeTransactionsFromString = (transactionsString) => transactionsString.split(',')
    .map(str => Buffer.from(str, 'base64'))
    .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer));

const calculateGasLimit = (actions) => actions
    .filter(a => Object.keys(a)[0] === 'functionCall')
    .map(a => a.functionCall.gas)
    .reduce((totalGas, gas) => totalGas.add(gas), new BN(0)).toString();

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

        let transactions;
        if (status === SIGN_STATUS.RETRY_TRANSACTION) {
            transactions = cloneDeep(state.transactions);
            transactions.forEach((t, i) => {
                t.actions && t.actions.forEach((a, j) => {
                    if(a.functionCall && a.functionCall.gas) {
                        if ((state.retryTxDirection || retryTxDirection) === RETRY_TX.INCREASE) {
                            a.functionCall.gas = a.functionCall.gas.add(new BN(RETRY_TX.GAS.DIFF));
                        } else if ((state.retryTxDirection || retryTxDirection) === RETRY_TX.DECREASE) {
                            a.functionCall.gas = a.functionCall.gas.sub(new BN(RETRY_TX.GAS.DIFF));
                        }
                    }
                });
            });
        } else {
            transactions = state.transactions;
        }

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
            : error.message.includes('TotalPrepaidGasExceeded')
                ? RETRY_TX.DECREASE
                : undefined;
        
        const tryRetryTx = retryTxDirection && !state.transactions.some((t) => 
            t.actions && t.actions.some((a) => a.functionCall && a.functionCall.gas && (
                (
                    state.retryTxDirection === RETRY_TX.INCREASE 
                    && (a.functionCall.gas.add(new BN(RETRY_TX.GAS.DIFF))).gt(new BN(RETRY_TX.GAS.MAX))
                ) || (
                    state.retryTxDirection === RETRY_TX.DECREASE 
                    && (a.functionCall.gas.sub(new BN(RETRY_TX.GAS.DIFF))).lte(new BN(RETRY_TX.GAS.MIN))
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