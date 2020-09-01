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
    getLedgerPublicKey,
    setLedgerTxSigned
} from '../../actions/account'

const initialState = {
    modal: {}
}

// TODO: Avoid listing all individual actions. Two approaches possible: 1) use meta to set a flag 2) dispatch action from Signer when signing is actually requested
const ledgerModalReducer = handleActions({
    [combineActions(sendMoney, addAccessKey, signAndSendTransactions, removeAccessKey, addAccessKeySeedPhrase, deleteRecoveryMethod, setupRecoveryMessage, addLedgerAccessKey, getLedgerPublicKey)]: (state, { ready, meta, type }) => ({
        ...state,
        modal: {
            show: !ready && (state.hasLedger || type === 'ADD_LEDGER_ACCESS_KEY' || type === 'GET_LEDGER_PUBLIC_KEY'),
            textId: !ready ? `${meta.prefix}.modal` : undefined
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
            txSign: undefined,
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
                    status: ready ? 'success' : 'confirm'
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
    [setLedgerTxSigned]: (state, { payload, meta }) => {
        const signInWithLedger = state.signInWithLedger && {
            ...state.signInWithLedger,
            [meta.accountId]: {
                status: (state.signInWithLedger[meta.accountId].status === 'confirm' && payload.status)
                    ? 'pending'
                    : state.signInWithLedger[meta.accountId].status
            }
        }

        return {
            ...state,
            txSigned: payload.status,
            signInWithLedger
        }
    },
}, initialState)

export default reduceReducers(
    initialState,
    ledger,
    ledgerModalReducer
)
