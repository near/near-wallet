import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { WalletError } from './walletError'

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
        const selectedValidator = await contract.get_staking_pool_account_id()

        if (!selectedValidator) {
            return {
                accountId: account_id,
                selectedValidator: '',
                totalUnstaked: await contract.get_owners_balance()
            }
        }

        const validator = validators.find((v) => v.accountId === selectedValidator)
        const deposited = new BN(await contract.get_known_deposited_balance(), 10)
        let totalUnstaked = (new BN(await contract.get_owners_balance(), 10)).sub(deposited)
        let totalStaked = new BN('0', 10);
        let totalUnclaimed = new BN('0', 10);
        let totalAvailable = new BN('0', 10);
        let totalPending = new BN('0', 10);

        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
            if (total.gt(new BN('0', 10))) {
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                validator.unclaimed = total.sub(deposited).toString()
                validator.unstaked = await validator.contract.get_account_unstaked_balance({ account_id })
                const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id })
                if (isAvailable) {
                    validator.available = validator.unstaked
                    totalAvailable = totalAvailable.add(new BN(validator.unstaked, 10))
                } else {
                    validator.pending = validator.unstaked
                    totalPending = totalPending.add(new BN(validator.unstaked, 10))
                }
            } else {
                console.log(validator.accountId)
            }
            totalUnstaked = totalUnstaked.add(new BN(validator.unstaked, 10))
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

    async unstake(useLockup) {
        const { lockupId } = await this.getLockup()
        await this.signAndSendTransaction(lockupId, [
            functionCall('unstake_all', {}, STAKING_GAS_BASE * 5, '0')
        ])
    }

    async withdraw(useLockup) {
        const { lockupId } = await this.getLockup()
        const withdraw_all_from_staking_pool = await this.signAndSendTransaction(lockupId, [
            functionCall('withdraw_all_from_staking_pool', {}, STAKING_GAS_BASE * 7, '0')
        ])
        await this.signAndSendTransaction(lockupId, [
            functionCall('unselect_staking_pool', {}, STAKING_GAS_BASE)
        ])
    }

    // helpers for lockup

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
            lockupId = await this.wallet.getLockupAccountId(accountId)
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
            throw new WalletError('No lockup contract for account')
        }
    }

    // helper for 2fa / signTx until refactor is merged
    async signAndSendTransaction(receiverId, actions) {
        return this.wallet.getAccount(this.wallet.accountId).signAndSendTransaction(receiverId, actions)
    }
}
