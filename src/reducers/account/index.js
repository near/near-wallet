import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    requestCode,
    setupRecoveryMessage,
    getAccessKeys,
    clear,
    clearCode,
    addAccessKey,
    addAccessKeySeedPhrase,
    clearAlert,
    refreshUrl,
    refreshAccount,
    resetAccounts,
    setFormLoader,
    deleteRecoveryMethod
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
    [combineActions(addAccessKey, addAccessKeySeedPhrase, setupRecoveryMessage, deleteRecoveryMethod)]: (state, { error, payload, meta }) => ({
        ...state,
        globalAlert: !!payload || error ? {
            success: !error,
            errorMessage: (error && payload && payload.toString()) || undefined,
            messageCode: error ? payload.messageCode || meta.errorCode || payload.id : meta.successCode,
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
            messageCode: error ? payload.messageCode || meta.errorCode : meta.successCode,
            id: payload.id || undefined
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
            locked: payload.locked,
            storageUsage: payload.storage_usage,
            accounts: payload.accounts,
            loader: false,
            loginResetAccounts: undefined,
            balance: payload.balance
        }
    },
    [resetAccounts]: (state) => ({
        ...state,
        loginResetAccounts: true
    }),
    [setFormLoader]: (state, { payload }) => ({
        ...state,
        formLoader: payload
    })
}, initialState)

export default reduceReducers(
    initialState,
    loaderReducer,
    globalAlertReducer,
    requestResultReducer,
    requestResultClearReducer,
    recoverCodeReducer,
    accessKeys,
    account,
    url
)
