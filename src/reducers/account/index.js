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
                lockupAccountId,
                stateStaked,
                lockupStateStaked,
                unreleasedAmount,
                lockupBalanceAvailable,
                lockupAmount
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
                lockupAccount
            } = payload
            const ZERO = new BN('0')

            lockupBalance = {
                sum: ZERO,
                reservedForStorage: new BN(lockupStateStaked),
                locked: {
                    sum: unreleasedAmount.sub(new BN(lockupStateStaked)),
                    inStakingPools: {
                        sum: ZERO,
                        staked: ZERO,
                        unstaked: ZERO,
                    }
                },
                unlocked: {
                    sum: new BN(lockupBalanceAvailable).add(stakedBalance).sub(unreleasedAmount.sub(new BN(lockupStateStaked))),
                    availableToTransfer: ZERO,
                    inStakingPools: {
                        sum: ZERO,
                        staked: ZERO,
                        unstaked: ZERO,
                    },
                }
            }

            let stakedBalanceHelper = stakedBalance
            let unstakedBalanceHelper = ZERO
            let totalAvailable = new BN(lockupAccount.totalAvailable)
            let lockupTotalPending = new BN(lockupAccount.totalPending)

            if (stakedBalanceHelper.gt(lockupBalance.unlocked.sum)) {
                lockupBalance.unlocked.inStakingPools.sum = lockupBalance.unlocked.sum
                lockupBalance.unlocked.availableToTransfer = lockupBalance.unlocked.sum.sub(lockupBalance.unlocked.inStakingPools.sum)

                if (totalAvailable.gt(lockupBalance.unlocked.sum) || lockupTotalPending.gt(lockupBalance.unlocked.sum)) {
                    lockupBalance.unlocked.inStakingPools.staked = ZERO
                    lockupBalance.unlocked.inStakingPools.unstaked = lockupBalance.unlocked.inStakingPools.sum

                    unstakedBalanceHelper = lockupTotalPending.add(totalAvailable).sub(lockupBalance.unlocked.inStakingPools.sum)
                    stakedBalanceHelper = stakedBalanceHelper.sub(unstakedBalanceHelper).sub(lockupBalance.unlocked.inStakingPools.sum)
                } else {
                    stakedBalanceHelper = stakedBalanceHelper.sub(lockupBalance.unlocked.sum)
                    lockupBalance.unlocked.inStakingPools.staked = lockupBalance.unlocked.inStakingPools.sum.sub(lockupTotalPending).sub(totalAvailable)
                    lockupBalance.unlocked.inStakingPools.unstaked = lockupTotalPending.add(totalAvailable)
                }
            } else {
                stakedBalanceHelper = ZERO
                lockupBalance.unlocked.inStakingPools.sum = stakedBalance
                lockupBalance.unlocked.inStakingPools.staked = lockupBalance.unlocked.inStakingPools.sum.sub(totalAvailable).sub(lockupTotalPending)
                lockupBalance.unlocked.inStakingPools.unstaked = lockupTotalPending.add(totalAvailable)
                lockupBalance.unlocked.availableToTransfer = lockupBalance.unlocked.sum.sub(lockupBalance.unlocked.inStakingPools.sum)
            }
            
            lockupBalance.locked.inStakingPools.staked = stakedBalanceHelper
            lockupBalance.locked.inStakingPools.unstaked = unstakedBalanceHelper
            lockupBalance.locked.inStakingPools.sum = stakedBalanceHelper.add(unstakedBalanceHelper)

            lockupBalance.sum = lockupBalance.reservedForStorage.add(lockupBalance.locked.sum).add(lockupBalance.unlocked.sum)
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
