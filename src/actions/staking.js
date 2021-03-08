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
    stakingGetAccounts,
    stakingUpdateAccount,
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
    STAKING_GET_ACCOUNTS: wallet.staking.getAccounts.bind(wallet.staking),
    STAKING_UPDATE_ACCOUNT: wallet.staking.updateStakingAccount.bind(wallet.staking),
})
