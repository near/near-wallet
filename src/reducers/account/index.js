import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'
import { multisig, utils } from 'near-api-js'
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
        const { 
            balance, 
            account,
            lockupAccount,
        } = payload

        const ratioPrecision = 1000
        const stakedUnstakedRatio = (parseFloat(balance.stakedBalance.toString()) - parseFloat(lockupAccount.totalUnclaimed)) / parseFloat(balance.totalBalance.toString()) * ratioPrecision

        const profileBalance = {
            walletBalance: {
                sum: new BN(balance.stateStaked).add(new BN(account.totalStaked)).add(new BN(account.totalPending)).add(new BN(account.totalUnstaked)).toString(),
                reservedForStorage: balance.stateStaked,
                inStakingPools: {
                    sum: new BN(account.totalStaked).add(new BN(account.totalPending)).toString(),
                    staked: account.totalStaked,
                    unstaked: account.totalPending
                },
                available: account.totalUnstaked
            },
            LockupId: balance.lockupAccountId,
            lockupBalance: {
                sum: balance.totalBalance.add(new BN(balance.lockupStateStaked)).toString(),
                reservedForStorage: balance.lockupStateStaked,
                locked: {
                    sum: balance.lockedAmount.toString(),
                    inStakingPools: {
                        sum: balance.lockedAmount.toString(),
                        staked: balance.lockedAmount.mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision)).toString(),
                        unstaked: balance.lockedAmount.sub(balance.lockedAmount.mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision))).toString()
                    }
                },
                unlocked: {
                    sum: balance.ownersBalance.toString(),
                    availableToTransfer: lockupAccount.totalUnclaimed,
                    inStakingPools: {
                        sum: balance.ownersBalance.sub(new BN(lockupAccount.totalUnclaimed)).toString(),
                        staked: balance.ownersBalance.sub(new BN(lockupAccount.totalUnclaimed)).mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision)).toString(),
                        unstaked: balance.ownersBalance.sub(new BN(lockupAccount.totalUnclaimed)).sub(balance.ownersBalance.sub(new BN(lockupAccount.totalUnclaimed)).mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision))).toString()
                    },
                }
            },
        }

        return {
            ...state,
            profileBalance
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
