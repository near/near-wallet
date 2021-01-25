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

import { LOCKUP_MIN_BALANCE } from '../../utils/account-with-lockup'

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
                lockupAccountId,
                stateStaked,
                totalBalance,
                lockedAmount,
                liquidOwnersBalance,
                ownersBalance
            }, 
            account: {
                totalAvailable,
                totalPending,
                totalStaked,
                totalUnstaked
            },
            lockupIdExists
        } = payload

        const walletBalance = {
            walletBalance: new BN(totalStaked).add(new BN(totalPending)).add(new BN(totalAvailable)).add(new BN(totalUnstaked)).add(new BN(stateStaked)).toString(),
            reservedForStorage: stateStaked.toString(),
            inStakingPools: {
                sum: new BN(totalStaked).add(new BN(totalPending)).add(new BN(totalAvailable)).toString(),
                staked: totalStaked,
                pendingRelease: totalPending,
                availableForWithdraw: totalAvailable
            },
            available: totalUnstaked
        }

        let lockupBalance = {}
        if (lockupIdExists) {
            const {
                lockupAccount
            } = payload

            lockupBalance = {
                lockupBalance: totalBalance.toString(),
                reservedForStorage: LOCKUP_MIN_BALANCE.toString(),
                inStakingPools: {
                    sum: stakedBalance.add(new BN(lockupAccount.totalPending)).add(new BN(lockupAccount.totalAvailable)).toString(),
                    staked: stakedBalance.toString(),
                    pendingRelease: new BN(lockupAccount.totalPending).toString(),
                    availableForWithdraw: new BN(lockupAccount.totalAvailable).toString()
                },
                locked: lockedAmount.toString(),
                unlocked: {
                    sum: ownersBalance.toString(),
                    availableToTransfer: liquidOwnersBalance.toString()
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
