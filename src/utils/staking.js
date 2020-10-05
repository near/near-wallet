import * as nearApiJs from 'near-api-js'
import sha256 from 'js-sha256';
import BN from 'bn.js'
import { toNear, nearTo, gtZero } from './amounts'
import { queryExplorer } from './explorer-api'

const {
    transactions: {
        functionCall
    }
} =  nearApiJs

// 125 - 175 Tgas for lockup methods
const GAS_STAKE = '175000000000000'

/********************************
Deploying lockup via CLI for testing

1. download this file https://github.com/near/core-contracts/blob/master/lockup/res/lockup_contract.wasm
2. create a new account on testnet
3. near login (to the new account)
4. replace [accountId], [ownerAccountId] below and run the following:
near deploy --accountId=[accountId] --wasmFile lockup_contract.wasm --initFunction=new --initArgs='{"owner_account_id":"[ownerAccountId]","lockup_duration": "259200000000000","transfers_information":{"TransfersDisabled":{"transfer_poll_account_id":"vote.f863973.m0"}},"release_duration":"2592000000000000","staking_pool_whitelist_account_id":"whitelist.f863973.m0"}'
5. send funds to the lockup contract, this will be your lockup balance
6. add your owner accountId (account you will use to stake) and the lockup accountId to the mapping below this comment

********************************/

// add your lockup contract to this mapping
const testLockup = {
    'multisig.testnet': 'lu3.testnet',
    'xa4.testnet': 'lu3.testnet',
    'patrick12.testnet': 'patrick13.patrick12.testnet'
}

// TODO Contract Helper gas amount or attached gas?

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

const getLockupId = async (accountId) => {
    const hash = new Uint8Array(sha256.sha256.array(accountId));
    return Buffer.from(hash).toString('hex').substr(0, 40) + '.lockup.near'
}

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
        this.provider = wallet.connection.provider
        // window.staking = this
    }

    /********************************
    Updating staking state depending on lockup/account selected
    ********************************/

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

        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
            if (total.gt(new BN('0', 10))) {
                validator.staked = await validator.contract.get_account_staked_balance({ account_id })
                validator.unclaimed = total.sub(deposited).toString()
                validator.unstaked = await validator.contract.get_account_unstaked_balance({ account_id })
                const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id })
                if (isAvailable) {
                    validator.available = validator.unstaked
                } else {
                    validator.pending = validator.unstaked
                }
            }
            totalUnstaked = totalUnstaked.add(new BN(validator.unstaked, 10))
            totalStaked = totalStaked.add(new BN(validator.staked, 10))
            totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed, 10))
        } catch (e) {
            console.warn(e)
        }

        return {
            accountId: account_id,
            selectedValidator,
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
        console.log((await this.provider.validators()))

        return (await Promise.all(
            (await this.provider.validators()).current_validators.map(({ account_id }) => (async () => {
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

    /********************************
    Staking
    ********************************/

    async stake(useLockup, validatorId, amount) {
        amount = toNear(amount)
        const { contract, lockupId } = await this.getLockup()
        const selectedValidatorId = await contract.get_staking_pool_account_id()
        console.log('selectedValidatorId', selectedValidatorId)
        console.log('validatorId', validatorId)
        if (validatorId !== selectedValidatorId) {
            await this.lockupSelect(validatorId, lockupId, selectedValidatorId !== null)
        }
        return await this.lockupStake(lockupId, validatorId, amount)
        
        // WIP staking from account directly
        // const deposit_and_stake = await this.signAndSendTransaction(validatorId, [
        //     functionCall('deposit_and_stake', {}, GAS_STAKE, amount)
        // ])
        // console.log('deposit_and_stake', deposit_and_stake)
        // return deposit_and_stake
    }

    /********************************
    Lockup helpers
    ********************************/

    async unstake(useLockup) {
        const { lockupId } = await this.getLockup()
        const unstake_all = await this.signAndSendTransaction(lockupId, [
            functionCall('unstake_all', {}, GAS_STAKE)
        ])  
        console.log('unstake_all', unstake_all)
    }

    async withdraw(useLockup) {
        const { lockupId } = await this.getLockup()
        const withdraw_all_from_staking_pool = await this.signAndSendTransaction(lockupId, [
            functionCall('withdraw_all_from_staking_pool', {}, GAS_STAKE)
        ])
        console.log('withdraw_all_from_staking_pool', withdraw_all_from_staking_pool)
        if (withdraw_all_from_staking_pool[0] === false) {
            throw new Error('Unable to withdraw pending balance from validator')
        }
    }

    // helpers for lockup

    async lockupStake(lockupId, validatorId, amount) {
        try {
            const deposit_and_stake = await this.signAndSendTransaction(lockupId, [
                functionCall('deposit_and_stake', { amount }, GAS_STAKE)
            ])
            console.log('deposit_and_stake', deposit_and_stake)
            return deposit_and_stake
        } catch (e) {
            console.warn('Problem staking with validator', validatorId, e)
        }
    }

    async lockupSelect(validatorId, lockupId, unselect = false) {
        if (unselect) {
            try {
                const unselect_staking_pool = await this.signAndSendTransaction(lockupId, [
                    functionCall('unselect_staking_pool', {}, GAS_STAKE)
                ])
                console.log('unselect_staking_pool', unselect_staking_pool)
            } catch (e) {
                // error "There is still a deposit on the staking pool"
                console.warn('Problem unselecting validator', validatorId, e)
            }
        }
        try {
            const select_staking_pool = await this.signAndSendTransaction(lockupId, [
                functionCall('select_staking_pool', { staking_pool_account_id: validatorId }, GAS_STAKE)
            ])
            console.log('select_staking_pool', select_staking_pool)
        } catch (e) {
            // error "Staking pool is already selected"
            console.warn('Problem selecting validator', validatorId, e)
            throw new Error('Cannot select validator')
        }
    }

    async getLockup() {
        const accountId = this.wallet.accountId
        // for testing, replace with catch only
        let lockupId = `testinglockup.${accountId}`
        try {
            await (await new nearApiJs.Account(this.wallet.connection, lockupId)).state()
        } catch(e) {
            lockupId = testLockup[accountId] ? testLockup[accountId] : await getLockupId(accountId)
        }
        const contract = await this.getContractInstance(lockupId, lockupMethods)
        return { contract, lockupId, accountId }
    }

    async getContractInstance(contractId, methods) {
        try {
            await (await new nearApiJs.Account(this.wallet.connection, contractId)).state()
            return await new nearApiJs.Contract(this.wallet.getAccount(), contractId, { ...methods })
        } catch(e) {
            console.warn(e)
            throw Error('No lockup contract for account')
        }
    }

    // helper for 2fa / signTx

    async signAndSendTransaction(receiverId, actions) {
        const { accountId } = this.wallet
        const { account, has2fa } = await this.wallet.getAccountAndState(accountId)
        if (has2fa) {
            actions[0].functionCall.gas = GAS_STAKE
            return this.wallet.signAndSendTransactions([{receiverId, actions}], accountId)
        }
        return account.signAndSendTransaction(receiverId, actions)
    }
}
