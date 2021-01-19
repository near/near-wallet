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
    [getProfileBalance]: (state, { payload, ready, error }) => {
        if (!ready || error) {
            return state
        }

        const { 
            balance: {
                stakedBalance,
                totalBalance,
                lockupStateStaked,
                lockedAmount,
                ownersBalance,
                lockupAccountId,
                stateStaked
            }, 
            account: {
                totalStaked,
                totalPending,
                totalUnstaked
            },
            lockupIdExists
        } = payload


        const walletBalance = {
            sum: new BN(stateStaked).add(new BN(totalStaked)).add(new BN(totalPending)).add(new BN(totalUnstaked)).toString(),
            reservedForStorage: stateStaked,
            inStakingPools: {
                sum: new BN(totalStaked).add(new BN(totalPending)).toString(),
                staked: totalStaked,
                unstaked: totalPending
            },
            available: totalUnstaked
        }

        let lockupBalance = {}
        if (lockupIdExists) {
            const {
                lockupAccount: {
                    totalUnclaimed
                }
            } = payload

            const ratioPrecision = 1000000
            const stakedUnstakedRatio = (parseFloat(stakedBalance?.toString() || 0)) / (parseFloat(totalBalance.toString()) - parseFloat(totalUnclaimed)) * ratioPrecision
            
            lockupBalance = {
                sum: totalBalance.toString(),
                reservedForStorage: lockupStateStaked,
                locked: {
                    sum: lockedAmount.sub(new BN(lockupStateStaked)).toString(),
                    inStakingPools: {
                        sum: lockedAmount.sub(new BN(lockupStateStaked)).toString(),
                        staked: lockedAmount.mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision)).toString(),
                        unstaked: lockedAmount.sub(lockedAmount.mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision))).toString()
                    }
                },
                unlocked: {
                    sum: ownersBalance.toString(),
                    availableToTransfer: totalUnclaimed,
                    inStakingPools: {
                        sum: ownersBalance.sub(new BN(totalUnclaimed)).toString(),
                        staked: ownersBalance.sub(new BN(totalUnclaimed)).mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision)).toString(),
                        unstaked: ownersBalance.sub(new BN(totalUnclaimed)).sub(ownersBalance.sub(new BN(totalUnclaimed)).mul(new BN(stakedUnstakedRatio)).div(new BN(ratioPrecision))).toString()
                    },
                }
            }
        }

        return {
            ...state,
            profileBalance: {
                walletBalance,
                lockupId: lockupAccountId,
                lockupBalance,
                lockupIdExists
            }
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
