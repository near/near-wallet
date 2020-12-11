import { wallet } from '../utils/wallet'
import { createActions } from 'redux-actions'

export { ACCOUNT_DEFAULTS } from '../utils/staking'

export const {
    switchAccount,
    updateStaking,
    stake,
    unstake,
    withdraw,
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
        () => ({})
    ],
    UNSTAKE: [
        wallet.staking.unstake.bind(wallet.staking),
        () => ({})
    ],
    WITHDRAW: [
        wallet.staking.withdraw.bind(wallet.staking),
        () => ({})
    ],
})
