import { wallet } from '../utils/wallet'
import { createActions } from 'redux-actions'

export { ACCOUNT_DEFAULTS } from '../utils/staking'

const defaultCodesFor = (prefix, data) => ({ successCode: `${prefix}.success`, errorCode: `${prefix}.error`, prefix, data})

export const {
    switchAccount,
    updateStaking,
    stake,
    unstake,
    withdraw,
} = createActions({
    SWITCH_ACCOUNT: [
        wallet.staking.switchAccount.bind(wallet.staking),
        () => defaultCodesFor('staking.switchAccount')
    ],
    UPDATE_STAKING: [
        wallet.staking.updateStaking.bind(wallet.staking),
        () => defaultCodesFor('staking.updateStaking')
    ],
    STAKE: [
        wallet.staking.stake.bind(wallet.staking),
        () => defaultCodesFor('staking.stake')
    ],
    UNSTAKE: [
        wallet.staking.unstake.bind(wallet.staking),
        () => defaultCodesFor('staking.unstake')
    ],
    WITHDRAW: [
        wallet.staking.withdraw.bind(wallet.staking),
        () => defaultCodesFor('staking.withdraw')
    ],
})
