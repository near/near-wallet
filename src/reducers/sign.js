import { utils, transactions as transaction } from 'near-api-js'
import { handleActions } from 'redux-actions'
import BN from 'bn.js'

import { parseTransactionsToSign, signAndSendTransactions, setSignTransactionStatus } from '../actions/account'

const sign = handleActions({
    [parseTransactionsToSign]: (state, { payload: { transactions: transactionsString, callbackUrl } }) => {
        const transactions = transactionsString.split(',')
            .map(str => Buffer.from(str, 'base64'))
            .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer))

        const allActions = transactions.flatMap(t => t.actions)
        return {
            status: 'needs-confirmation',
            callbackUrl,
            transactions,
            totalAmount: allActions
                .map(a => (a.transfer && a.transfer.deposit) || (a.functionCall && a.functionCall.deposit) || 0)
                .reduce((totalAmount, amount) => totalAmount.add(amount), new BN(0)).toString(),
            fees: {
                transactionFees: '', // TODO: Calculate total fees
                gasLimit: allActions
                    .filter(a => Object.keys(a)[0] === 'functionCall')
                    .map(a => a.functionCall.gas)
                    .reduce((totalGas, gas) => totalGas.add(gas)).toString(),
                gasPrice: '' // TODO: Where to get gas price?
            },
            sensitiveActionsCounter: allActions
                .filter(a => ['deployContract', 'stake', 'deleteAccount'].indexOf(Object.keys(a)[0]) > -1)
                .length
        }
    },
    [signAndSendTransactions]: (state, { error, payload, ready }) => {

        if (!ready) {
            return {
                ...state,
                status: 'needs-confirmation'
            }
        }

        if (error) {
            return {
                ...state,
                status: 'error',
                error: payload
            }
        }

        return {
            ...state,
            status: 'success'
        }
    },
    [setSignTransactionStatus]: (state, { payload }) => {
        return {
            ...state,
            status: payload.status
        }
    }
}, {
    status: 'needs-confirmation'
})

export default sign