import { wallet } from '../utils/wallet'
import { createActions } from 'redux-actions'
import BN from 'bn.js'
import * as nearApiJs from 'near-api-js'

import { showAlert } from '../utils/alerts'
import { 
    getStakingDeposits, 
    STAKING_AMOUNT_DEVIATION,
    ZERO,
    MIN_DISPLAY_YOCTO,
    MIN_LOCKUP_AMOUNT,
    ACCOUNT_DEFAULTS,
    lockupMethods
} from '../utils/staking'
export { ACCOUNT_DEFAULTS } from '../utils/staking'

let ghValidators

// to przeniesc do redux???
const stakingMethods = {
    viewMethods: [
        'get_account_staked_balance',
        'get_account_unstaked_balance',
        'get_account_total_balance',
        'is_account_unstaked_balance_available',
        'get_total_staked_balance',
        'get_owner_id',
        'get_reward_fee_fraction',
    ],
    changeMethods: [
        'ping',
        'deposit',
        'deposit_and_stake',
        'deposit_to_staking_pool',
        'stake',
        'stake_all',
        'unstake',
        'withdraw',
    ],
}

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount
        }
    },
    Account,
    Contract
} = nearApiJs

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
        STAKE: {
            LOCKUP: async (contract, lockupId, validatorId, amount) => {
                const selectedValidatorId = await contract.get_staking_pool_account_id()
                if (validatorId !== selectedValidatorId) {
                    await wallet.staking.lockupSelect(validatorId, lockupId, selectedValidatorId !== null)
                }
                return await wallet.staking.signAndSendTransaction(lockupId, [
                    functionCall('deposit_and_stake', { amount }, STAKING_GAS_BASE * 5, '0')
                ])
            },
            ACCOUNT: async (validatorId, amount) => {
                const result = await wallet.staking.signAndSendTransaction(validatorId, [
                    functionCall('deposit_and_stake', {}, STAKING_GAS_BASE * 5, amount)
                ])
                // wait for chain/explorer to index results
                await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
                await wallet.staking.updateStakedBalance(validatorId)
                return result
            },
        },
        UPDATE_ACCOUNT: async (balance, validators, accountId, validatorDepositMap) => {
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

            return {
                accountId,
                validators: validators.filter((v) => !v.remove),
                selectedValidator: null,
                totalUnstaked: totalUnstaked.toString(),
                totalStaked: totalStaked.toString(),
                totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
                totalPending: totalPending.toString(),
                totalAvailable: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
            }
        },
        UPDATE_LOCKUP: async (contract, account_id, exAccountId) => {
            // use MIN_LOCKUP_AMOUNT vs. actual storage amount
            const deposited = new BN(await contract.get_known_deposited_balance())
            let totalUnstaked = new BN(await contract.get_owners_balance())
                .add(new BN(await contract.get_locked_amount()))
                .sub(MIN_LOCKUP_AMOUNT)
                .sub(deposited)

            // minimum displayable for totalUnstaked 
            if (totalUnstaked.lt(new BN(parseNearAmount('0.002')))) {
                totalUnstaked = ZERO.clone()
            }
            
            // validator specific
            const selectedValidator = await contract.get_staking_pool_account_id()
            if (!selectedValidator) {
                return {
                    ...ACCOUNT_DEFAULTS,
                    accountId: account_id,
                    totalUnstaked: totalUnstaked.toString(),
                    mainAccountId: exAccountId
                }
            }
            let validator = (await wallet.staking.getValidators([selectedValidator], accountId))[0]

            let totalStaked = ZERO.clone();
            let totalUnclaimed = ZERO.clone();
            let totalAvailable = ZERO.clone();
            let totalPending = ZERO.clone();
            let total
            const minimumUnstaked = new BN('100'); // 100 yocto

            try {
                total = new BN(await validator.contract.get_account_total_balance({ account_id }))
                if (total.gt(ZERO)) {
                    validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                    validator.unclaimed = total.sub(deposited).toString()
                    validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }))
                    if (validator.unstaked.gt(minimumUnstaked)) {
                        const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id })
                        if (isAvailable) {
                            validator.available = validator.unstaked.toString()
                            totalAvailable = totalAvailable.add(validator.unstaked)
                        } else {
                            validator.pending = validator.unstaked.toString()
                            totalPending = totalPending.add(validator.unstaked)
                        }
                    }
                } else {
                    validator.remove = true
                }
                totalStaked = totalStaked.add(new BN(validator.staked || ZERO.clone()))
                totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed || ZERO.clone()))
            } catch (e) {
                if (e.message.indexOf('cannot find contract code') === -1) {
                    console.warn('Error getting data for validator', validator.accountId, e)
                }
            }

            return {
                mainAccountId: exAccountId,
                accountId: account_id,
                validators: !validator.remove ? [validator] : [],
                selectedValidator,
                totalPending: totalPending.toString(),
                totalAvailable: totalAvailable.toString(),
                totalStaked: totalStaked.toString(),
                totalUnstaked: totalUnstaked.toString(),
                totalUnclaimed: totalUnclaimed.toString(),
                totalBalance: total.toString()
            }
        },
        UPDATE_CURRENT: null,
        GET_LOCKUP: async (accountId) => {
            let lockupId
            if (process.env.REACT_APP_USE_TESTINGLOCKUP && accountId.length < 64) {
                lockupId = `testinglockup.${accountId}`
            } else {
                lockupId = getLockupAccountId(accountId)
            }
            const contract = await wallet.staking.getContractInstance(lockupId, lockupMethods, accountId)
            return { contract, lockupId, accountId }
        },
        GET_VALIDATORS: async (accountIds, accountId) => {
            const { current_validators, next_validators, current_proposals } = await wallet.connection.provider.validators()
            const currentValidators = current_validators.map(({ account_id }) => account_id)
            
            if (!accountIds) {
                const rpcValidators = [...current_validators, ...next_validators, ...current_proposals].map(({ account_id }) => account_id)

                // TODO use indexer - getting all historic validators from raw GH script .json
                const networkId = wallet.connection.provider.connection.url.indexOf('mainnet') > -1 ? 'mainnet' : 'testnet'
                if (!ghValidators) {
                    ghValidators = (await fetch(`https://raw.githubusercontent.com/frol/near-validators-scoreboard/scoreboard-${networkId}/validators_scoreboard.json`).then((r) => r.json()))
                    .map(({ account_id }) => account_id)
                }

                accountIds = [...new Set([...rpcValidators, ...ghValidators])]
                    .filter((v) => v.indexOf('nfvalidator') === -1 && v.indexOf(networkId === 'mainnet' ? '.near' : '.m0') > -1)
            }

            const currentAccount = await wallet.getAccount(accountId)

            return (await Promise.all(
                accountIds.map(async (account_id) => {
                    try {
                        const contract = new Contract(currentAccount, account_id, stakingMethods)
                        const validator = {
                            accountId: account_id,
                            active: currentValidators.includes(account_id),
                            contract
                        }
                        const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                        fee.percentage = +(fee.numerator / fee.denominator * 100).toFixed(2)
                        return validator
                    } catch (e) {
                        console.warn('Error getting fee for validator %s: %s', account_id, e);
                    }
                })
            )).filter((v) => !!v)
        }
    }
})

const handleGetAccounts = () => async (dispatch, getState) => {
    await dispatch(handleGetLockup())

    return await dispatch(staking.getAccounts({
        accountId: wallet.accountId, 
        lockupId : getState().staking.lockup.lockupId
    }))
}

export const handleGetLockup = (accountId) => async (dispatch, getState) => {
    try {
        await dispatch(staking.getLockup(accountId || getState().account.accountId))
    } catch(e) {
        if (!/No contract for account/.test(e.message)) {
            throw e
        }
    }
}

export const handleStakingUpdateAccount = (recentlyStakedValidators = [], exAccountId) => async (dispatch, getState) => {
    const { accountId, balance } = exAccountId
        ? getState().allAccounts[exAccountId]
        : getState().account

    const validatorDepositMap = await getStakingDeposits(accountId)

    const validators = getState().staking.allValidators.filter((validator) => 
        Object.keys(validatorDepositMap).concat(recentlyStakedValidators).includes(validator.accountId)
    )

    await dispatch(staking.updateAccount(balance, validators, accountId, validatorDepositMap))
}

export const handleStakingUpdateLockup = (exAccountId) => async (dispatch, getState) => {
    const { contract, lockupId: account_id } = getState().staking.lockup

    await dispatch(staking.updateLockup(contract, account_id, exAccountId))
}

export const handleStake = (validatorId, amount) => async (dispatch, getState) => {
    const { accountId } = getState().staking.accountsObj
    const { currentAccountId } = getState().staking.currentAccount
    
    const isLockup = currentAccountId !== accountId
    if (amount.length < 15) {
        amount = parseNearAmount(amount)
    }
    if (isLockup) {
        const { contract, lockupId } = getState().staking.lockup
        return dispatch(staking.stake.lockup(contract, lockupId, validatorId, amount))
    }
    return dispatch(staking.stake.account(validatorId, amount))
}

export const handleUnstake = (validatorId, amount) => async (dispatch, getState) => {
    const { accountId } = getState().staking.accountsObj
    const { currentAccountId } = getState().staking.currentAccount

    const isLockup = currentAccountId !== accountId
    if (amount && amount.length < 15) {
        amount = parseNearAmount(amount)
    }
    if (isLockup) {
        const { lockupId } = getState().staking.lockup
        return wallet.staking.lockupUnstake(lockupId, amount)
    }
    return wallet.staking.accountUnstake(validatorId, amount)
}

export const updateStakingEx = (currentAccountId, recentlyStakedValidators) => async (dispatch, getState) => {
    const { accountId, lockupId } = (await dispatch(handleGetAccounts())).payload

    await dispatch(staking.getValidators(null, accountId))

    await dispatch(handleStakingUpdateAccount(recentlyStakedValidators))
    if (lockupId) {
        await dispatch(handleStakingUpdateLockup())
    }

    dispatch(staking.updateCurrent(currentAccountId || accountId))
}
