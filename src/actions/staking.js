import { wallet } from '../utils/wallet'
import { createActions } from 'redux-actions'
import BN from 'bn.js'

import { showAlert } from '../utils/alerts'
export { ACCOUNT_DEFAULTS } from '../utils/staking'
import { 
    getStakingDeposits, 
    STAKING_AMOUNT_DEVIATION,
    ZERO,
    MIN_DISPLAY_YOCTO
} from '../utils/staking'

export const {
    switchAccount,
    updateStaking,
    stake,
    unstake,
    withdraw,
    staking
} = createActions({
    SWITCH_ACCOUNT: [
        wallet.staking.switchAccount.bind(wallet.staking),
        () => ({})
    ],
    UPDATE_STAKING: [
        wallet.staking.updateStaking.bind(wallet.staking),
        () => ({})
    ],
    STAKE: [
        wallet.staking.stake.bind(wallet.staking),
        () => showAlert({ onlyError: true })
    ],
    UNSTAKE: [
        wallet.staking.unstake.bind(wallet.staking),
        () => showAlert({ onlyError: true })
    ],
    WITHDRAW: [
        wallet.staking.withdraw.bind(wallet.staking),
        () => showAlert({ onlyError: true })
    ],

    STAKING: {
        GET_ACCOUNTS: null,
        UPDATE_ACCOUNT: null,
        UPDATE_LOCKUP: wallet.staking.updateStakingLockup.bind(wallet.staking),
        UPDATE_CURRENT: null
    }
})

const handleGetAccounts = () => async (dispatch, getState) => {
    return await dispatch(staking.getAccounts({
        accountId: wallet.accountId, 
        lockupId : await wallet.staking.checkLockupExists(wallet.accountId)
    }))
}

const handleStakingUpdateAccount = (recentlyStakedValidators = []) => async (dispatch, getState) => {
    const { accountId, balance } = getState().account

    const account = await wallet.getAccount(accountId)
    const validatorDepositMap = await getStakingDeposits(accountId)
    let validators = await wallet.staking.getValidators([...new Set(Object.keys(validatorDepositMap).concat(recentlyStakedValidators))], accountId)

    let totalUnstaked = new BN(balance.available)
    if (totalUnstaked.lt(new BN(STAKING_AMOUNT_DEVIATION))) {
        totalUnstaked = ZERO.clone();
    }
    let totalStaked = ZERO.clone();
    let totalUnclaimed = ZERO.clone();
    let totalAvailable = ZERO.clone();
    let totalPending = ZERO.clone();

    await Promise.all(validators.map(async (validator, i) => {
        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id: accountId }))
            if (total.lte(ZERO)) {
                validator.remove = true
                return
            }

            // try to get deposits from explorer
            const deposit = new BN(validatorDepositMap[validator.accountId] || '0')
            validator.staked = await validator.contract.get_account_staked_balance({ account_id: accountId })

            // rewards (lifetime) = total - deposits
            validator.unclaimed = total.sub(deposit).toString()
            if (!deposit.gt(ZERO) || new BN(validator.unclaimed).lt(MIN_DISPLAY_YOCTO)) {
                validator.unclaimed = ZERO.clone().toString()
            }

            validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id: accountId }))
            if (validator.unstaked.gt(MIN_DISPLAY_YOCTO)) {
                const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id: accountId })
                if (isAvailable) {
                    validator.available = validator.unstaked.toString()
                    totalAvailable = totalAvailable.add(validator.unstaked)
                } else {
                    validator.pending = validator.unstaked.toString()
                    totalPending = totalPending.add(validator.unstaked)
                }
            }

            totalStaked = totalStaked.add(new BN(validator.staked))
            totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed))
        } catch (e) {
            if (e.message.indexOf('cannot find contract code') === -1) {
                console.warn('Error getting data for validator', validator.accountId, e)
            }
        }
    }))

    dispatch(staking.updateAccount({
        accountId,
        validators: validators.filter((v) => !v.remove),
        selectedValidator: null,
        totalUnstaked: totalUnstaked.toString(),
        totalStaked: totalStaked.toString(),
        totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
        totalPending: totalPending.toString(),
        totalAvailable: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
    }))
}

export const updateStakingEx = (currentAccountId, recentlyStakedValidators) => async (dispatch, getState) => {
    const { accountId, lockupId } = (await dispatch(handleGetAccounts())).payload

    await dispatch(handleStakingUpdateAccount(recentlyStakedValidators))
    if (lockupId) {
        await dispatch(staking.updateLockup())
    }

    dispatch(staking.updateCurrent(currentAccountId || accountId))
}
