import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { WalletError } from './walletError'
import { getLockupAccountId } from './account-with-lockup'
import { ACCOUNT_HELPER_URL } from './wallet'

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

export const ACCOUNT_DEFAULTS = {
    selectedValidator: '',
    totalPending: '0', // pending withdrawal
    totalAvailable: '0', // available for withdrawal
    totalUnstaked: '0', // available to be staked
    totalStaked: '0', 
    totalUnclaimed: '0', // total rewards paid out - staking deposits made
    validators: [],
}
export const STAKING_AMOUNT_DEVIATION = parseNearAmount('0.00001')

const STAKE_VALIDATOR_PREFIX = '__SVPRE__'
const ZERO = new BN('0')
const MIN_DISPLAY_YOCTO = new BN('100');
const EXPLORER_DELAY = 2000
const MIN_LOCKUP_AMOUNT = new BN(process.env.MIN_LOCKUP_AMOUNT || parseNearAmount('35.00001'))
const STAKING_GAS_BASE = process.env.REACT_APP_STAKING_GAS_BASE || '25000000000000' // 25 Tgas

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

const lockupMethods = {
    viewMethods: [
        'get_balance',
        'get_locked_amount',
        'get_owners_balance',
        'get_staking_pool_account_id',
        'get_known_deposited_balance',
    ]
}

// caching value in module, no need to fetch frequently
let ghValidators

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
        this.provider = wallet.connection.provider
    }

    /********************************
    Updating the state of the user's staking based on whether they've selected their lockup account or regular account
    ********************************/

    async switchAccount(accountId, accounts) {
        return { currentAccount: accounts.find((a) => a.accountId === accountId) }
    }

    async getAccounts() {
        return { 
            accountId: this.wallet.accountId, 
            lockupId : await this.checkLockupExists(accountId)
        }
    }

    async checkLockupExists(accountId) {
        let lockupId
        try {
            const { lockupId: _lockupId } = await this.getLockup(accountId)
            lockupId = _lockupId
        } catch(e) {
            if (!/No contract for account/.test(e.message)) {
                throw e
            }
        }
        return lockupId
    }

    async updateStaking(currentAccountId, recentlyStakedValidators) {
        const { accountId, lockupId } = await this.getAccounts()
        if (!currentAccountId) currentAccountId = accountId

        const allValidators = await this.getValidators()
        const state = {}
        const account = await this.updateStakingAccount(allValidators, recentlyStakedValidators)
        let lockupAccount
        if (lockupId) {
            lockupAccount = await this.updateStakingLockup()
        }
        state.allValidators = allValidators
        state.replaceState = true
        state.accounts = [account]
        if (lockupAccount) {
            state.accounts.push(lockupAccount)
        }
        state.currentAccount = currentAccountId === accountId ? account : lockupAccount 

        console.log('staking', state)

        return state
    }

    async updateStakingLockup(accountId) {
        const { contract, lockupId: account_id } = await this.getLockup(accountId)

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
            }
        }
        let validator = (await this.getValidators([selectedValidator], accountId))[0]

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
    }

    async updateStakingAccount(allValidators, recentlyStakedValidators = [], account_id = this.wallet.accountId) {
        await this.wallet.refreshAccount()
        const account = await this.wallet.getAccount(account_id)
        const balance = account.wrappedAccount ? await account.wrappedAccount.getAccountBalance() : await account.getAccountBalance()

        // const validatorDepositMap = await getStakingTransactions(account_id)
        const validatorDepositMap = await getStakingDeposits(account_id)

        let validators = await this.getValidators([...new Set(Object.keys(validatorDepositMap).concat(recentlyStakedValidators))], account_id)

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
                const total = new BN(await validator.contract.get_account_total_balance({ account_id }))
                if (total.lte(ZERO)) {
                    validator.remove = true
                    return
                }

                // try to get deposits from explorer
                const deposit = new BN(validatorDepositMap[validator.accountId] || '0')
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })

                // rewards (lifetime) = total - deposits
                validator.unclaimed = total.sub(deposit).toString()
                if (!deposit.gt(ZERO) || new BN(validator.unclaimed).lt(MIN_DISPLAY_YOCTO)) {
                    validator.unclaimed = ZERO.clone().toString()
                }

                validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }))
                if (validator.unstaked.gt(MIN_DISPLAY_YOCTO)) {
                    const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id })
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
            accountId: account_id,
            validators: validators.filter((v) => !v.remove),
            selectedValidator: null,
            totalUnstaked: totalUnstaked.toString(),
            totalStaked: totalStaked.toString(),
            totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
            totalPending: totalPending.toString(),
            totalAvailable: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
        }
    }

    async getValidators(accountIds, accountId) {
        const { current_validators, next_validators, current_proposals } = await this.provider.validators()
        const currentValidators = current_validators.map(({ account_id }) => account_id)
        
        if (!accountIds) {
            const rpcValidators = [...current_validators, ...next_validators, ...current_proposals].map(({ account_id }) => account_id)

            // TODO use indexer - getting all historic validators from raw GH script .json
            const networkId = this.provider.connection.url.indexOf('mainnet') > -1 ? 'mainnet' : 'testnet'
            if (!ghValidators) {
                ghValidators = (await fetch(`https://raw.githubusercontent.com/frol/near-validators-scoreboard/scoreboard-${networkId}/validators_scoreboard.json`).then((r) => r.json()))
                .map(({ account_id }) => account_id)
            }

            accountIds = [...new Set([...rpcValidators, ...ghValidators])]
                .filter((v) => v.indexOf('nfvalidator') === -1 && v.indexOf(networkId === 'mainnet' ? '.near' : '.m0') > -1)
        }

        const currentAccount = await this.wallet.getAccount(accountId)
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
                    fee.percentage = fee.numerator / fee.denominator * 100
                    return validator
                } catch (e) {
                    console.warn('Error getting fee for validator %s: %s', account_id, e);
                }
            })
        )).filter((v) => !!v)
    }

    /********************************
    Staking API for redux actions
    ********************************/

    // isLockup will be set by user in redux state and passed through actions
    async stake(currentAccountId, validatorId, amount) {
        const { accountId } = await this.getAccounts()
        const isLockup = currentAccountId !== accountId
        if (amount.length < 15) {
            amount = parseNearAmount(amount)
        }
        if (isLockup) {
            const { contract, lockupId } = await this.getLockup()
            return this.lockupStake(contract, lockupId, validatorId, amount)
        }
        return this.accountStake(validatorId, amount)
    }

    async unstake(currentAccountId, validatorId, amount) {
        const { accountId } = await this.getAccounts()
        const isLockup = currentAccountId !== accountId
        if (amount && amount.length < 15) {
            amount = parseNearAmount(amount)
        }
        if (isLockup) {
            const { lockupId } = await this.getLockup()
            return this.lockupUnstake(lockupId, amount)
        }
        return this.accountUnstake(validatorId, amount)
    }

    async withdraw(currentAccountId, validatorId, amount) {
        const { accountId } = await this.getAccounts()
        const isLockup = currentAccountId !== accountId
        if (amount && amount.length < 15) {
            amount = parseNearAmount(amount)
        }
        if (isLockup) {
            const { lockupId } = await this.getLockup()
            return this.lockupWithdraw(lockupId, amount)
        }
        return this.accountWithdraw(validatorId, amount)
    }

    /********************************
    Lockup
    ********************************/

    async lockupWithdraw(lockupId, amount) {
        let result
        if (amount) {
            result = await this.signAndSendTransaction(lockupId, [
                functionCall('withdraw_from_staking_pool', { amount }, STAKING_GAS_BASE * 5, '0')
            ])
        } else {
            result = await this.signAndSendTransaction(lockupId, [
                functionCall('withdraw_all_from_staking_pool', {}, STAKING_GAS_BASE * 7, '0')
            ])
        }
        if (result === false) {
            throw new WalletError('Unable to withdraw pending balance from validator', 'staking.noWithdraw')
        }
        return result
    }

    async lockupUnstake(lockupId, amount) {
        if (amount) {
            return await this.signAndSendTransaction(lockupId, [
                functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0')
            ])
        }
        return await this.signAndSendTransaction(lockupId, [
            functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
        ])
    }

    async lockupStake(contract, lockupId, validatorId, amount) {
        const selectedValidatorId = await contract.get_staking_pool_account_id()
        if (validatorId !== selectedValidatorId) {
            await this.lockupSelect(validatorId, lockupId, selectedValidatorId !== null)
        }
        return await this.signAndSendTransaction(lockupId, [
            functionCall('deposit_and_stake', { amount }, STAKING_GAS_BASE * 5, '0')
        ])
    }

    async lockupSelect(validatorId, lockupId, unselect = false) {
        if (unselect) {
            await this.signAndSendTransaction(lockupId, [
                functionCall('unselect_staking_pool', {}, STAKING_GAS_BASE, '0')
            ])
        }
        await this.signAndSendTransaction(lockupId, [
            functionCall('select_staking_pool', { staking_pool_account_id: validatorId }, STAKING_GAS_BASE * 3, '0')
        ])
    }

    async getLockup() {
        const accountId = this.wallet.accountId
        let lockupId
        if (process.env.REACT_APP_USE_TESTINGLOCKUP && accountId.length < 64) {
            lockupId = `testinglockup.${accountId}`
        } else {
            lockupId = getLockupAccountId(accountId)
        }
        const contract = await this.getContractInstance(lockupId, lockupMethods)
        return { contract, lockupId, accountId }
    }

    /********************************
    Account
    ********************************/

    async accountWithdraw(validatorId, amount) {
        let result
        if (amount) {
            result = await this.signAndSendTransaction(validatorId, [
                functionCall('withdraw', { amount }, STAKING_GAS_BASE * 5, '0')
            ])
        } else {
            result = await this.signAndSendTransaction(validatorId, [
                functionCall('withdraw_all', {}, STAKING_GAS_BASE * 7, '0')
            ])
        }
        if (result === false) {
            throw new WalletError('Unable to withdraw pending balance from validator', 'staking.noWithdraw')
        }
        // wait for explorer to index results
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        return result
    }

    async accountUnstake(validatorId, amount) {
        let result
        if (amount) {
            result = await this.signAndSendTransaction(validatorId, [
                functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0')
            ])
        } else {
            result = await this.signAndSendTransaction(validatorId, [
                functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
            ])
        }
        // wait for explorer to index results
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        await this.updateStakedBalance(validatorId)
        return result
    }

    async accountStake(validatorId, amount) {
        const result = await this.signAndSendTransaction(validatorId, [
            functionCall('deposit_and_stake', {}, STAKING_GAS_BASE * 5, amount)
        ])
        // wait for chain/explorer to index results
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        await this.updateStakedBalance(validatorId)
        return result
    }

    async updateStakedBalance(validatorId) {
        const { accountId: account_id } = await this.getAccounts()
        const contract = await this.getContractInstance(validatorId, stakingMethods)
        const lastStakedBalance = await contract.get_account_staked_balance({ account_id })
        localStorage.setItem(STAKE_VALIDATOR_PREFIX + validatorId + account_id, lastStakedBalance)
    }

    /********************************
    Helpers
    ********************************/

    async getContractInstance(contractId, methods) {
        try {
            await (await new Account(this.wallet.connection, contractId)).state()
            return await new Contract(await this.wallet.getAccount(this.wallet.accountId), contractId, { ...methods })
        } catch (e) {
            throw new WalletError('No contract for account', 'staking.noLockup')
        }
    }

    async signAndSendTransaction(receiverId, actions) {
        return (await this.wallet.getAccount(this.wallet.accountId)).signAndSendTransaction(receiverId, actions)
    }
}

async function getStakingDeposits(accountId) {
    let stakingDeposits = await fetch(ACCOUNT_HELPER_URL + '/staking-deposits/' + accountId).then((r) => r.json()) 

    const validatorDepositMap = {}
    stakingDeposits.forEach(({ validator_id, deposit }) => {
        validatorDepositMap[validator_id] = deposit
    })
    
    return validatorDepositMap
}

