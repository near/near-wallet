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
    connectLedger,
    setLedgerTxSigned,
    createNewAccount
} from '../../actions/account'

const initialState = {
    modal: {}
}

// TODO: Avoid listing all individual actions. Two approaches possible: 1) use meta to set a flag 2) dispatch action from Signer when signing is actually requested
const ledgerModalReducer = handleActions({
    [combineActions(sendMoney, addAccessKey, signAndSendTransactions, removeAccessKey, addAccessKeySeedPhrase, deleteRecoveryMethod, setupRecoveryMessage, addLedgerAccessKey, getLedgerPublicKey, connectLedger, createNewAccount)]: (state, { ready, meta, type, error }) => ({
        ...state,
        modal: {
            show: !meta.isNew && !ready && (state.hasLedger || type === 'ADD_LEDGER_ACCESS_KEY' || type === 'GET_LEDGER_PUBLIC_KEY'),
            textId: !ready ? `${meta.prefix}.modal` : undefined
        },
        txSigned: (error || ready) ? undefined : state.txSigned
    })
}, initialState)

const ledger = handleActions({
    [getLedgerAccountIds]: (state, { error, payload, ready }) => {
        if (error) {
            return {
                ...state,
                signInWithLedgerStatus: payload.messageCode === 'signInLedger.getLedgerAccountIds.noAccounts' ? 'enter-accountId' : undefined,
                signInWithLedger: undefined,
                txSigned: undefined
            }
        }

        return {
            ...state,
            signInWithLedgerStatus: !ready ? 'confirm-public-key' : 'confirm-accounts',
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
                signInWithLedgerStatus: undefined,
                signInWithLedger: undefined,
                txSigned: undefined
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
    [saveAndSelectLedgerAccounts]: (state, { error, ready }) => {
        if (error) {
            return {
                ...state,
                signInWithLedgerStatus: undefined,
                signInWithLedger: undefined
            }
        }

        return ready 
            ? {
                ...state,
                signInWithLedgerStatus: ready ? undefined : state.signInWithLedgerStatus,
                signInWithLedger: undefined
            }
            : state
    },
    [refreshAccount]: (state, { payload }) => {
        return {
            ...state,
            ...(payload && payload.ledger)
        }
    },
    [setLedgerTxSigned]: (state, { payload, meta }) => {
        const signInWithLedger = (meta.accountId && Object.keys(state.signInWithLedger || {}).length )
            ? {
                ...state.signInWithLedger,
                [meta.accountId]: {
                    status: (state.signInWithLedger[meta.accountId].status === 'confirm' && payload.status)
                        ? 'pending'
                        : state.signInWithLedger[meta.accountId].status
                }
            }
            : undefined

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
