import { wallet } from '../utils/wallet'
import { createActions } from 'redux-actions'

import { showAlert } from '../utils/alerts'
export { ACCOUNT_DEFAULTS } from '../utils/staking'

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
        UPDATE_ACCOUNT: wallet.staking.updateStakingAccount.bind(wallet.staking),
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

export const updateStakingEx = (currentAccountId, recentlyStakedValidators) => async (dispatch, getState) => {
    const { accountId, lockupId } = (await dispatch(handleGetAccounts())).payload

    await dispatch(staking.updateAccount(recentlyStakedValidators))
    if (lockupId) {
        await dispatch(staking.updateLockup())
    }

    dispatch(staking.updateCurrent(currentAccountId || accountId))
}
