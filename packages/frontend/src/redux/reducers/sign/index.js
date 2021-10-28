import BN from 'bn.js';
import { utils, transactions as transaction } from 'near-api-js';
import { handleActions } from 'redux-actions';

import { parseTransactionsToSign, makeAccountActive, multiplyGas } from '../../actions/account';
import { handleSignTransactions } from '../../slices/sign';

export const MULTIPLY_TX_GAS_BY = 2;

const initialState = {
    status: 'needs-confirmation'
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
            status: 'needs-confirmation',
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
    [handleSignTransactions.pending]: (state, { error, payload, ready }) => ({
        ...state,
        status: 'in-progress'
    }),
    [handleSignTransactions.fulfilled]: (state, { error, meta, payload, ready }) => ({
        ...state,
        status: 'success',
        transactionHashes: payload
    }),
    [handleSignTransactions.rejected]: (state, { error, payload, ready }) => ({
        ...state,
        status: error.message.includes('Exceeded the prepaid gas')
            ? 'retry-tx'
            : 'error',
        error: error
    }),
    [multiplyGas]: (state, { payload: { transactions: transactionsString } }) => {
        const transactions = deserializeTransactionsFromString(transactionsString);

        transactions.forEach((t, i) => {
            t.actions.forEach((a, j) => {
                if (!!a.functionCall) {
                    const currentGas = state.transactions[i].actions[j].functionCall.gas;
                    a.functionCall.gas = currentGas.mul(new BN(MULTIPLY_TX_GAS_BY));
                }
            });
        });

        return {
            ...state,
            transactions,
            fees: {
                ...state.transactions.fees,
                gasLimit: calculateGasLimit(transactions.flatMap(t => t.actions))
            }
        };
    },
    [makeAccountActive]: () => {
        return initialState;
    }
}, initialState);

export default sign;