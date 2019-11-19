import { utils, transactions as transaction } from 'nearlib'
import { handleActions } from 'redux-actions'

import { parseTransactionsToSign } from '../../actions/account'

export default transactionsToSignReducer = handleActions({
    [parseTransactionsToSign]: (state, { payload }) => {
        const transactions = payload.split(',')
            .map(str => Buffer.from(str, 'base64'))
            .map(buffer => utils.serialize.deserialize(transaction.SCHEMA, transaction.Transaction, buffer))

        return {
            ...state,
            sign: {
                transactions,
                fees: {
                    transactionFees: '',
                    gasLimit: transactions.reduce((c, t) =>
                        c + t.actions.reduce((ca, a) =>
                            Object.keys(a)[0] === 'functionCall'
                                ? ca + a.functionCall.gas
                                : ca
                            , 0)
                        , 0),
                    gasPrice: ''
                },
                sensitiveActionsCounter: transactions.reduce((c, t) =>
                    c + t.actions.reduce((ca, a) =>
                        ['deployContract', 'stake', 'deleteAccount'].indexOf(Object.keys(a)[0]) > -1
                            ? ca + 1
                            : ca
                        , 0)
                    , 0)
            }
        }
    }
}, { sign: {} })
