import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'
import { utils } from 'near-api-js'
import BN from 'bn.js'

import {
    requestCode,
    getAccessKeys,
    clearCode,
    promptTwoFactor,
    refreshUrl,
    refreshAccount,
    resetAccounts,
    checkCanEnableTwoFactor,
    get2faMethod,
    getLedgerKey,
    getProfileBalance
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
    [getProfileBalance]: (state, { payload, ready, meta }) => {
        if (!ready) {
            return state
        }

        const { formatNearAmount } = utils.format
        const { balance, stakingLockup } = payload

        const profileBalance = {
            walletBalance: {
                sum: new BN(balance.stateStaked).add(new BN(stakingLockup.totalStaked)).add(new BN(stakingLockup.totalPending)).add(new BN(stakingLockup.totalUnstaked)).toString(),
                reservedForStorage: balance.stateStaked,
                inStakingPools: {
                    sum: new BN(stakingLockup.totalStaked).add(new BN(stakingLockup.totalPending)).toString(),
                    staked: stakingLockup.totalStaked,
                    unstaked: stakingLockup.totalPending
                },
                available: stakingLockup.totalUnstaked
            },
            LockupId: '',
            lockupBalance: {
                sum: '',
                reservedForStorage: '',
                locked: {
                    sum: '',
                    inStakingPools: {
                        sum: '',
                        staked: '',
                        unstaked: ''
                    }
                },
                unlocked: {
                    sum: '',
                    availableToTransfer: '',
                    inStakingPools: {
                        sum: '',
                        staked: '',
                        unstaked: ''
                    }
                }
            },
            availableToWithdraw: stakingLockup.totalAvailable
        }

        const formatAll = (obj) => Object.keys(obj).reduce((x, prop) => ({
            ...x,
            [prop]: typeof obj[prop] === 'object'
                ? formatAll(obj[prop])
                : formatNearAmount(obj[prop], 5)
        }), {})

        return {
            ...state,
            profileBalance: formatAll(profileBalance)
        }
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
