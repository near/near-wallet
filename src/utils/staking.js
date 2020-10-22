import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { WalletError } from './walletError'
import { getLockupAccountId } from './account-with-lockup'
import { queryExplorer } from './explorer-api'
import { gtZero } from './amounts'

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount
        }
    }
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

const ZERO = new BN('0', 10)
const MIN_DISPLAY_YOCTO = new BN('100', 10);
const EXPLORER_DELAY = 4000
const MIN_LOCKUP_AMOUNT = new BN(process.env.MIN_LOCKUP_AMOUNT || parseNearAmount('35.00001'), 10)
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
        const accountId = this.wallet.accountId
        let lockupId
        try {
            const { lockupId: _lockupId } = await this.getLockup()
            lockupId = _lockupId
        } catch(e) {
            console.warn('No lockup account, not loading lockup account state for account', accountId)
            if (e.message.indexOf('does not exist while viewing') === -1) {
                throw(e)
            }
        }
        return { accountId, lockupId }
    }

    async updateStaking(currentAccountId, recentlyStakedValidators) {
        const { accountId, lockupId } = await this.getAccounts()
        if (!currentAccountId) currentAccountId = accountId

        const allValidators = await this.getValidators()
        const state = {}
        const account = await this.updateStakingAccount(recentlyStakedValidators)
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

    async updateStakingLockup() {
        const { contract, lockupId: account_id } = await this.getLockup()

        // use MIN_LOCKUP_AMOUNT vs. actual storage amount
        const deposited = new BN(await contract.get_known_deposited_balance(), 10)
        let totalUnstaked = new BN(await contract.get_owners_balance(), 10)
            .add(new BN(await contract.get_locked_amount(), 10))
            .sub(MIN_LOCKUP_AMOUNT)
            .sub(deposited)

        // minimum displayable for totalUnstaked 
        if (totalUnstaked.lt(new BN(parseNearAmount('0.002'), 10))) {
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
        let validator = validator = (await this.getValidators([selectedValidator]))[0]

        let totalStaked = ZERO.clone();
        let totalUnclaimed = ZERO.clone();
        let totalAvailable = ZERO.clone();
        let totalPending = ZERO.clone();
        const minimumUnstaked = new BN('100', 10); // 100 yocto

        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
            if (total.gt(ZERO)) {
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                validator.unclaimed = total.sub(deposited).toString()
                validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }), 10)
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
                console.log(validator.accountId)
            }
            totalStaked = totalStaked.add(new BN(validator.staked || ZERO.clone(), 10))
            totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed || ZERO.clone(), 10))
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
        }
    }

    async updateStakingAccount(recentlyStakedValidators) {

        const account_id = this.wallet.accountId
        const account = this.wallet.getAccount(this.wallet.accountId)
        const balance = await account.getAccountBalance()

        let { deposits, validators } = (await getStakingTransactions(account_id))
        validators = await this.getValidators([...new Set(validators.concat(recentlyStakedValidators))])

        let totalUnstaked = new BN(balance.available, 10).sub(new BN(parseNearAmount('1'), 10))
        console.log(totalUnstaked.toString())
        if (totalUnstaked.lt(new BN(STAKING_AMOUNT_DEVIATION, 10))) {
            totalUnstaked = ZERO.clone();
        }
        let totalStaked = ZERO.clone();
        let totalUnclaimed = ZERO.clone();
        let totalAvailable = ZERO.clone();
        let totalPending = ZERO.clone();

        await Promise.all(validators.map(async (validator, i) => {
            try {
                const total = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
                if (total.lte(ZERO)) {
                    validator.remove = true
                    return
                }
                // totalUnstaked = totalUnstaked.sub(total)
                // pull deposits out of txs
                let validatorDeposits = ZERO.clone()
                deposits.forEach(({ accountId, deposit }) => {
                    if (validator.accountId !== accountId) return
                    validatorDeposits = validatorDeposits.add(deposit)
                })
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                // TODO replace total.sub(total) with total.sub(deposited) to calc rewards
                validator.unclaimed = total.sub(validatorDeposits).toString()
                validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }), 10)
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
                if (new BN(validator.unclaimed, 10).lt(MIN_DISPLAY_YOCTO)) {
                    validator.unclaimed = ZERO.clone()
                }
                totalStaked = totalStaked.add(new BN(validator.staked, 10))
                totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed, 10))
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

    async getValidators(accountIds) {
        if (!accountIds) {
            accountIds = (await this.provider.validators()).current_validators.map(({ account_id }) => account_id)
        }
        return (await Promise.all(
            accountIds.map(async (account_id) => {
                const validator = {
                    accountId: account_id,
                    contract: await this.getContractInstance(account_id, stakingMethods)
                }
                try {
                    const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                    fee.percentage = fee.numerator / fee.denominator * 100
                    return validator
                } catch (e) {
                    if (!/cannot find contract code|wasm execution failed/.test(e.message)) {
                        throw(e)
                    }
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
            throw new WalletError('Unable to withdraw pending balance from validator', 'staking.errors.noWithdraw')
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
        await (await new nearApiJs.Account(this.wallet.connection, lockupId)).state()
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
            throw new WalletError('Unable to withdraw pending balance from validator', 'staking.errors.noWithdraw')
        }
        // wait 3s for explorer to index results
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        return result
    }

    async accountUnstake(validatorId, amount) {
        let result
        if (amount) {
            result = await this.signAndSendTransaction(validatorId, [
                functionCall('unstake', { amount }, STAKING_GAS_BASE * 5, '0')
            ])
        }
        result = await this.signAndSendTransaction(validatorId, [
            functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
        ])
        // wait 3s for explorer to index results
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        return result
    }

    async accountStake(validatorId, amount) {
        const result = await this.signAndSendTransaction(validatorId, [
            functionCall('deposit_and_stake', {}, STAKING_GAS_BASE * 5, amount)
        ])
        // wait 3s for explorer to index results
        const t = Date.now()
        await new Promise((r) => setTimeout(r, EXPLORER_DELAY))
        return result
    }

    /********************************
    Helpers
    ********************************/

    async getContractInstance(contractId, methods) {
        try {
            await (await new nearApiJs.Account(this.wallet.connection, contractId)).state()
            return await new nearApiJs.Contract(this.wallet.getAccount(), contractId, { ...methods })
        } catch (e) {
            throw new WalletError('No contract for account', 'staking.errors.noLockup')
        }
    }

    async signAndSendTransaction(receiverId, actions) {
        return this.wallet.getAccount(this.wallet.accountId).signAndSendTransaction(receiverId, actions)
    }
}


async function getStakingTransactions(accountId) {
    const methods = ['stake', 'deposit_and_stake', 'stake_all', 'unstake', 'unstake_all']

    const sql = `
        SELECT
            transactions.hash, 
            transactions.signer_id,
            transactions.receiver_id,
            transactions.block_timestamp, 
            actions.action_type as kind, 
            actions.action_args as args
        FROM 
            transactions
        LEFT JOIN actions ON actions.transaction_hash = transactions.hash
        WHERE 
            transactions.signer_id = :accountId AND
            actions.action_type = 'FunctionCall' AND
            json_extract(actions.action_args, '$.method_name') in (:methods)
        ORDER BY 
            block_timestamp DESC
        LIMIT 
            :offset, :count
    `

    const params = {
        accountId,
        offset: 0,
        count: 500,
        methods
    }

    let tx = await queryExplorer(sql, params)
    tx = Array.isArray(tx) ? tx : []
    let validators = [], deposits = []
    tx.forEach(({ receiver_id, args }) => {
        validators.push(receiver_id)
        const deposit = new BN(JSON.parse(args).deposit, 10)
        if (deposit.gt(new BN('0'))) {
            deposits.push({ accountId: receiver_id, deposit })
        }
    })
    validators = [...new Set(validators)]

    console.log({ validators, deposits })

    return { validators, deposits }
}
