import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    requestCode,
    getAccessKeys,
    getTransactions,
    clear,
    clearCode,
    addAccessKey,
    addAccessKeySeedPhrase,
    clearAlert,
    refreshUrl,
    refreshAccount,
    resetAccounts,
    getTransactionStatus
} from '../../actions/account'

const initialState = {
    formLoader: false,
    sentMessage: false,
    actionsPending: []
}

const loaderReducer = (state, { type, ready }) => {
    if (typeof ready === 'undefined') {
        return state
    }

    const actionsPending = !ready ? [...state.actionsPending, type] : state.actionsPending.slice(0, -1)
    return { 
        ...state, 
        formLoader: !!actionsPending.length,
        actionsPending
    }
}

const globalAlertReducer = handleActions({
    // TODO: Reset state before action somehow. On navigate / start of other action?
    // TODO: Make this generic to avoid listing actions
    [combineActions(addAccessKey, addAccessKeySeedPhrase)]: (state, { error, payload, meta }) => ({
        ...state,
        globalAlert: !!payload || error ? {
            success: !error,
            errorMessage: (error && payload && payload.toString()) || undefined,
            messageCode: error ? payload.messageCode || meta.errorCode : meta.successCode,
            data: meta.data
        } : undefined
    }),
    [clearAlert]: state => Object.keys(state).reduce((obj, key) => key !== 'globalAlert' ? (obj[key] = state[key], obj) : obj, {})
}, initialState)

const requestResultReducer = (state, { error, payload, meta }) => {
    if (!meta || !meta.successCode) {
        return state
    }
    return {
        ...(state || initialState),
        requestStatus: !!payload || error ? {
            success: !error,
            errorMessage: (error && payload && payload.toString()) || undefined,
            messageCode: error ? payload.messageCode || meta.errorCode : meta.successCode 
        } : undefined
    }
}

const requestResultClearReducer = handleActions({
    // TODO: Should clear be a separate action or happen automatically on navigate / start of other actions?
    [clear]: state => Object.keys(state).reduce((obj, key) => key !== 'requestStatus' ? (obj[key] = state[key], obj) : obj, {})
}, initialState)

const recoverCodeReducer = handleActions({
    [requestCode]: (state, { error, ready }) => {
        if (ready && !error) {
            return { ...state, sentMessage: true }
        }
        return state
    },
    [clearCode]: (state, { error, ready }) => {
        return { ...state, sentMessage: false }
    }
}, initialState)

const accessKeys = handleActions({
    [getAccessKeys]: (state, { error, payload }) => ({
        ...state,
        authorizedApps: payload && payload.filter(it => it.access_key && it.access_key.permission.FunctionCall),
        fullAccessKeys: payload && payload.filter(it => it.access_key && it.access_key.permission === 'FullAccess'),
    })
}, initialState)

const transactions = handleActions({
    [getTransactions]: (state, { error, payload, ready }) => {
        const hash = state.transactions && state.transactions.reduce((h, t) => ({
            ...h,
            [t.hash_with_index]: t
        }), {})
        
        return ({
            ...state,
            transactions: (ready && !error) 
                ? payload.map((t) => (
                    (hash && Object.keys(hash).includes(t.hash_with_index))
                        ? {
                            ...t,
                            status: hash[t.hash_with_index].status,
                            checkStatus: hash[t.hash_with_index].checkStatus
                        } 
                        : t
                ))
                : state.transactions

        })
    },
    [getTransactionStatus]: (state, { error, payload, ready, meta }) => ({
        ...state,
        transactions: state.transactions.map((t) => (
            t.hash === meta.hash
                ? {
                    ...t,
                    checkStatus: (ready && !error) 
                        ? !['SuccessValue', 'Failure'].includes(Object.keys(payload.status)[0]) 
                        : false,
                    status: (ready && !error) 
                        ? Object.keys(payload.status)[0] 
                        : error 
                            ? 'notAvailable' 
                            : ''
                }
                : t
        ))
    })
}, initialState)

const url = handleActions({
    [refreshUrl]: (state, { payload }) => ({
        ...state,
        url: payload
    })
}, initialState)

const account = handleActions({
    [refreshAccount]: (state, { error, payload, ready, meta }) => {
        if (!ready) {
            return {
                ...state,
                loader: meta.accountId !== state.accountId
            }
        }

        if (error) {
            return {
                ...state,
                loader: false,
                loginError: payload.message
            }
        }

        return {
            ...state,
            accountId: payload.accountId,
            amount: payload.amount,
            stake: payload.stake,
            nonce: payload.nonce,
            code_hash: payload.code_hash,
            accounts: payload.accounts,
            loader: false,
            loginResetAccounts: undefined
        }
    },
    [resetAccounts]: (state) => ({
        ...state,
        loginResetAccounts: true
    }),
}, initialState)

export default reduceReducers(
    initialState,
    loaderReducer,
    globalAlertReducer,
    requestResultReducer,
    requestResultClearReducer,
    recoverCodeReducer,
    accessKeys,
    transactions,
    account,
    url
)
