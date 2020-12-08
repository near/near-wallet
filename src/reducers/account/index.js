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
    promptTwoFactor,
    refreshUrl,
    refreshAccount,
    resetAccounts,
    deleteRecoveryMethod,
    recoverAccountSeedPhrase,
    removeAccessKey,
    deployMultisig,
    verifyTwoFactor,
    checkCanEnableTwoFactor,
    get2faMethod,
    getLedgerKey,
    sendMoney,
    saveAndSelectLedgerAccounts,
    signAndSendTransactions,
    addLedgerAccessKey,
    addLedgerAccountId,
    createAccountWithSeedPhrase,
    getLedgerAccountIds
} from '../../actions/account'

import {
    stake,
    unstake,
    withdraw,
} from '../../actions/staking'

const initialState = {
    formLoader: false,
    sentMessage: false,
    requestPending: null,
    actionsPending: [],
    canEnableTwoFactor: null,
    twoFactor: null,
    ledgerKey: null
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

const requestResultReducer = (state, { error, ready, payload, meta }) => {
    if (!meta || !meta.successCode) {
        return state
    }

    return {
        ...(state || initialState),
        requestStatus: ready ? {
            success: !error,
            errorMessage: (error && payload && payload.toString()) || undefined,
            messageCode: error ? payload.messageCode || meta.errorCode : meta.successCode,
            id: (payload && payload.id) || undefined
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
        authorizedApps: payload && payload.filter(it => it.access_key && it.access_key.permission.FunctionCall && it.access_key.permission.FunctionCall.receiver_id !== state.accountId),
        fullAccessKeys: payload && payload.filter(it => it.access_key && it.access_key.permission === 'FullAccess'),
    })
}, initialState)

const url = handleActions({
    [refreshUrl]: (state, { payload }) => ({
        ...state,
        url: payload
    })
}, initialState)

const canEnableTwoFactor = handleActions({
    [checkCanEnableTwoFactor]: (state, { payload }) => ({
        ...state,
        canEnableTwoFactor: payload
    })
}, initialState)

const twoFactor = handleActions({
    [get2faMethod]: (state, { payload }) => ({
        ...state,
        twoFactor: payload
    })
}, initialState)

const twoFactorPrompt = handleActions({
    [promptTwoFactor]: (state, { payload }) => ({
        ...state,
        requestPending: payload.requestPending
    })
}, initialState)

const ledgerKey = handleActions({
    [getLedgerKey]: (state, { payload }) => ({
        ...state,
        ledgerKey: payload
    })
}, initialState)

const account = handleActions({
    [refreshAccount]: (state, { payload, ready, meta }) => {

        if (!ready) {
            return {
                ...state,
                loader: meta.accountId !== state.accountId
            }
        }

        const resetAccountState = {
            globalAlertPreventClear: payload && payload.globalAlertPreventClear,
            resetAccount: (state.resetAccount && state.resetAccount.preventClear) ? {
                ...state.resetAccount,
                preventClear: false
            } : payload && payload.resetAccount
        }
        
        return {
            ...state,
            ...payload,
            ledger: undefined,
            ...resetAccountState,
            loader: false
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
    requestResultReducer,
    requestResultClearReducer,
    recoverCodeReducer,
    accessKeys,
    account,
    url,
    canEnableTwoFactor,
    twoFactor,
    twoFactorPrompt,
    ledgerKey
)
