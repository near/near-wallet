import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import {
    requestCode,
    getAccessKeys,
    clearCode,
    promptTwoFactor,
    refreshUrl,
    refreshAccountOwner,
    resetAccounts,
    checkCanEnableTwoFactor,
    get2faMethod,
    getLedgerKey,
    updateStakingAccount,
    updateStakingLockup,
    getBalance,
    selectAccount
} from '../../actions/account'

const initialState = {
    formLoader: false,
    sentMessage: false,
    requestPending: null,
    actionsPending: [],
    canEnableTwoFactor: null,
    twoFactor: null,
    ledgerKey: null
}

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
    [refreshAccountOwner]: (state, { payload, ready, meta }) => {

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
            balance: {
                ...payload?.balance,
                ...state.balance
            },
            ledger: undefined,
            ...resetAccountState,
            loader: false
        }
    },
    [resetAccounts]: (state) => ({
        ...state,
        loginResetAccounts: true
    }),
    [updateStakingAccount]: (state, { error, payload, ready }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    account: payload
                }
            }),
    [updateStakingLockup]: (state, { error, payload, ready }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    lockupAccount: payload
                }
            }),
    [getBalance]: (state, { error, payload, ready}) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    ...payload
                }
            }),
    [selectAccount]: () => {
        return initialState
    }
}, initialState)

export default reduceReducers(
    initialState,
    recoverCodeReducer,
    accessKeys,
    account,
    url,
    canEnableTwoFactor,
    twoFactor,
    twoFactorPrompt,
    ledgerKey
)
