import { utils, transactions as transaction } from 'nearlib'
import { handleActions } from 'redux-actions'

import { parseTransactionsToSign } from '../../actions/account'

export default transactionsToSignReducer = handleActions({
    [parseTransactionsToSign]: (state, { payload }) => {
        const transactions = payload.split(',')
            .map(str => Buffer.from(str, 'base64'))
            .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer))

        const allActions = transactions.flatMap(t => t.actions)
        return {
            ...state,
            sign: {
                transactions,
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
        }
    }
}, { sign: {} })
