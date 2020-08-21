import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    getLedgerAccountIds,
    addLedgerAccountId,
    saveAndSelectLedgerAccounts,
    refreshAccount,
    sendMoney,
    addAccessKey,
    signAndSendTransactions,
    removeAccessKey,
    addAccessKeySeedPhrase,
    deleteRecoveryMethod,
    setupRecoveryMessage,
    addLedgerAccessKey,
    getLedgerPublicKey
} from '../../actions/account'

const initialState = {
    modal: {}
}

const ledgerModalReducer = handleActions({
    [combineActions(sendMoney, addAccessKey, signAndSendTransactions, removeAccessKey, addAccessKeySeedPhrase, deleteRecoveryMethod, setupRecoveryMessage, addLedgerAccessKey, getLedgerPublicKey)]: (state, { ready, meta, type }) => ({
        ...state,
        modal: {
            show: !ready && (state.hasLedger || type === 'ADD_LEDGER_ACCESS_KEY' || type === 'GET_LEDGER_PUBLIC_KEY'),
            textId: `${meta.prefix}.modal`
        }
    })
}, initialState)

const ledger = handleActions({
    [getLedgerAccountIds]: (state, { error, payload }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return {
            ...state,
            signInWithLedger: payload 
                ? payload.reduce((r, accountId) => ({
                    ...r,
                    [accountId]: {
                        status: 'waiting'
                    }
                }), {})
                : {}
        }
    },
    [addLedgerAccountId]: (state, { error, ready, meta }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return {
            ...state,
            signInWithLedger: {
                ...state.signInWithLedger,
                [meta.accountId]: {
                    status: ready ? 'success' : 'pending'
                }
            }
        }
    },
    [saveAndSelectLedgerAccounts]: (state, { error }) => {
        if (error) {
            return {
                ...state,
                signInWithLedger: undefined
            }
        }

        return state
    },
    [refreshAccount]: (state, { payload }) => {
        return {
            ...state,
            ...(payload && payload.ledger)
        }
    },
}, initialState)

export default reduceReducers(
    initialState,
    ledger,
    ledgerModalReducer
)
