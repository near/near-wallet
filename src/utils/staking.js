import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { WalletError } from './walletError'
import { getLockupAccountId } from './account-with-lockup'

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount
        }
    }
} =  nearApiJs

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

        console.log(this)
    }

    async updateStaking(useLockup) {
        const validators = await this.getValidators()
        const state = {
            validators,
            ...(useLockup ? await this.updateStakingLockup(validators) : {})
        }
        console.log(state)
        return state
    }

    async updateStakingLockup(validators) {
        const { contract, lockupId: account_id } = await this.getLockup()

        // use MIN_LOCKUP_AMOUNT vs. actual storage amount
        const deposited = new BN(await contract.get_known_deposited_balance(), 10)
        let totalUnstaked = new BN(await contract.get_owners_balance(), 10)
            .add(new BN(await contract.get_locked_amount(), 10))
            .sub(MIN_LOCKUP_AMOUNT)
            .sub(deposited)

        // minimum displayable for totalUnstaked 
        if (totalUnstaked.lt(new BN(parseNearAmount('0.002'), 10))) {
            totalUnstaked = new BN('0', 10)
        }

        // validator specific
        const selectedValidator = await contract.get_staking_pool_account_id()
        if (!selectedValidator) {
            return {
                accountId: account_id,
                selectedValidator: '',
                totalUnstaked: totalUnstaked.toString(),
            }
        }
        const validator = validators.find((v) => v.accountId === selectedValidator)

        let totalStaked = new BN('0', 10);
        let totalUnclaimed = new BN('0', 10);
        let totalAvailable = new BN('0', 10);
        let totalPending = new BN('0', 10);
        const minimumUnstaked = new BN('100', 10); // 100 yocto
        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
            if (total.gt(new BN('0', 10))) {
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                validator.unclaimed = total.sub(deposited).toString()
                validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id }), 10)
                if (validator.unstaked.gt(minimumUnstaked)) {
                    const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id })
                    if (isAvailable) {
                        validator.available = validator.unstaked.toString()
                        totalAvailable = totalAvailable.add(validator.unstaked)
                        totalUnstaked = totalUnstaked.add(validator.unstaked)
                    } else {
                        validator.pending = validator.unstaked.toString()
                        totalPending = totalPending.add(validator.unstaked)
                    }
                }
            } else {
                console.log(validator.accountId)
            }
            totalStaked = totalStaked.add(new BN(validator.staked, 10))
            totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed, 10))
        } catch (e) {
            console.warn('Error getting data for validator', validator.accountId, e)
        }

        return {
            accountId: account_id,
            selectedValidator,
            totalPending: totalPending.toString(),
            totalAvailable: totalAvailable.toString(),
            totalStaked: totalStaked.toString(),
            totalUnstaked: totalUnstaked.toString(),
            totalUnclaimed: totalUnclaimed.toString(),
        }
    }

    // TODO when we enable direct account staking
    async updateStakingAccount() {
        return {}
    }

    async getValidators() {
        return (await Promise.all(
            (await this.provider.validators()).current_validators
            .map(({ account_id }) => (async () => {
                const validator = {
                    accountId: account_id,
                    staked: '0',
                    unclaimed: '0',
                    pending: '0',
                    available: '0',
                    contract: await this.getContractInstance(account_id, stakingMethods)
                }
                try {
                    const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                    fee.percentage = fee.numerator / fee.denominator * 100
                    return validator
                } catch (e) {
                    console.warn(e)
                }
            })())
        )).filter((v) => !!v)
    }

    // useLockup will be set by user in redux state and passed through actions
    async stake(useLockup, validatorId, amount) {
        amount = parseNearAmount(amount)
        const { contract, lockupId } = await this.getLockup()
        const selectedValidatorId = await contract.get_staking_pool_account_id()
        if (validatorId !== selectedValidatorId) {
            await this.lockupSelect(validatorId, lockupId, selectedValidatorId !== null)
        }
        return await this.lockupStake(lockupId, validatorId, amount)
    }

    // helpers for lockup

    async unstake(useLockup, amount) {
        const { lockupId } = await this.getLockup()
        await this.signAndSendTransaction(lockupId, [
            functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
        ])
    }

    async withdraw(useLockup, amount) {
        const { lockupId } = await this.getLockup()
        const withdraw_all_from_staking_pool = await this.signAndSendTransaction(lockupId, [
            functionCall('withdraw_all_from_staking_pool', {}, STAKING_GAS_BASE * 7, '0')
        ])
        if (withdraw_all_from_staking_pool[0] === false) {
            throw new WalletError('Unable to withdraw pending balance from validator', 'staking.errors.noWithdraw')
        }
        const state = await this.updateStaking(true)
        if (state.totalPending === '0' && state.totalStaked === '0') {
            console.log('calling unselect_staking_pool')
            await this.signAndSendTransaction(lockupId, [
                functionCall('unselect_staking_pool', {}, STAKING_GAS_BASE)
            ])
        }
    }

    async lockupStake(lockupId, validatorId, amount) {
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
        if (process.env.REACT_APP_USE_TESTINGLOCKUP) {
            lockupId = `testinglockup.${accountId}`
        } else {
            lockupId = getLockupAccountId(accountId)
        }
        await (await new nearApiJs.Account(this.wallet.connection, lockupId)).state()
        const contract = await this.getContractInstance(lockupId, lockupMethods)
        return { contract, lockupId, accountId }
    }

    async getContractInstance(contractId, methods) {
        try {
            await (await new nearApiJs.Account(this.wallet.connection, contractId)).state()
            return await new nearApiJs.Contract(this.wallet.getAccount(), contractId, { ...methods })
        } catch(e) {
            throw new WalletError('No lockup contract for account', 'staking.errors.noLockup')
        }
    }

    // helper for 2fa / signTx until refactor is merged
    async signAndSendTransaction(receiverId, actions) {
        return this.wallet.getAccount(this.wallet.accountId).signAndSendTransaction(receiverId, actions)
    }
}
