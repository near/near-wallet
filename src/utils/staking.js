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

const GAS_STAKE = '200000000000000' // 200 Tgas
const GAS_2FA_STAKE = '125000000000000' // 125 Tgas for most methods

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

    async updateStaking({ useLockup }) {
        const validators = await this.getValidators()
        return {
            validators,
            ...(useLockup ? await this.getValidatorsLockup(validators) : {})
        }
    }

    async getValidatorsLockup(validators) {
        const accountId = this.wallet.accountId
        const lockupId = testLockup[accountId] ? testLockup[accountId] : await getLockupId(accountId)
        // current staking account_id
        const account_id = lockupId

        const lockup = {
            id: lockupId,
            validator: '',
            deposited: new BN('0', 10),
            available: new BN('0', 10),
            contract: await this.getContractInstance(lockupId, lockupMethods)
        }

        if (!lockup.contract) {
            throw Error('No lockup contract for account')
        }
        lockup.available = new BN(await lockup.contract.get_owners_balance(), 10).sub(lockup.deposited).toString()
        lockup.validator = await this.lockupGetSelected(lockupId)
        if (!lockup.validator) {
            return {
                lockup
            }
        }
        lockup.deposited = new BN(await lockup.contract.get_known_deposited_balance(), 10)
        // debugging
        console.log('lockup available balance', nearTo(lockup.available))
        const validator = validators.find((v) => v.name === lockup.validator)

        const zero = new BN('0', 10)
        let totalStaked = new BN('0', 10);
        let totalUnclaimedRewards = new BN('0', 10);

        try {
            const totalBalance = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
            if (totalBalance.gt(zero)) {
                validator.stakedBalance = await validator.contract.get_account_staked_balance({ account_id })
                console.log(validator.stakedBalance)
                validator.unstakedBalance = await validator.contract.get_account_unstaked_balance({ account_id })
                validator[`unstakedAvailable_${account_id}`] = await validator.contract.is_account_unstaked_balance_available({ account_id })
                // console.log('stakedBalance inner', name, account_id, stakedBalance.toString())
                // console.log('unstakedBalance inner', name, account_id, unstakedBalance.toString())
            }
            validator.totalBalance = totalBalance.toString()
            totalStaked = totalStaked.add(new BN(validator.stakedBalance, 10))
            // unclaimed rewards
            let principleStaked = new BN('0', 10)
            // if validator is selected lockup validator base principle on lockup.deposited
            principleStaked = principleStaked.add(lockup.deposited)
            validator.principleStaked = principleStaked.toString()
            const unclaimedRewards = totalBalance.sub(principleStaked)
            validator.unclaimedRewards = unclaimedRewards.toString()
            totalUnclaimedRewards = totalUnclaimedRewards.add(unclaimedRewards)
            
        } catch (e) {
            console.warn(e)
        }

        const state = {
            lockup,
            totalStaked: totalStaked.toString(),
            totalUnclaimedRewards: totalUnclaimedRewards.toString(),
        }

        console.log('getValidatorsLockup', state)

        return state
    }

    // TODO when we enable direct account staking
    async getValidatorsAccount() {
        return {}
    }

    async getValidators() {
        return (await Promise.all(
            (await this.provider.validators()).current_validators.map(({ account_id }) => (async () => {
                const validator = {
                    name: account_id,
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


    async stake(validatorId, amount) {
        amount = toNear(amount)
        const accountId = this.wallet.accountId
        const lockupId = testLockup[accountId] ? testLockup[accountId] : await getLockupId(accountId)
        // try to source funds from lockup contract
        const lockupContract = await this.getContractInstance(lockupId, lockupMethods)
        
        if (lockupContract) {
            const selectedValidatorId = await this.lockupGetSelected(lockupId)
            console.log('selectedValidatorId', selectedValidatorId)
            console.log('validatorId', validatorId)
            if (validatorId !== selectedValidatorId) {
                await this.lockupSelect(validatorId, lockupId, selectedValidatorId !== null)
            }
            return await this.lockupStake(lockupId, validatorId, amount)
        }
        // staking from account directly
        const deposit_and_stake = await this.signAndSendTransaction(validatorId, [
            functionCall('deposit_and_stake', {}, GAS_STAKE, amount)
        ])
        console.log('deposit_and_stake', deposit_and_stake)
        return deposit_and_stake
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

    async lockupGetSelected(lockupId) {
        const account_id = this.wallet.accountId
        const account = this.wallet.getAccount(account_id)
        const lockup = await new nearApiJs.Contract(account, lockupId, { ...lockupMethods })
        return await lockup.get_staking_pool_account_id()
    }

    async getContractInstance(contractId, methods) {
        try {
            await (await new nearApiJs.Account(this.wallet.connection, contractId)).state()
            return await new nearApiJs.Contract(this.wallet.getAccount(), contractId, { ...methods })
        } catch(e) {
            console.warn(e)
            return null
        }
    }

    // helper for 2fa / signTx

    async signAndSendTransaction(receiverId, actions) {
        const { accountId } = this.wallet
        const { account, has2fa } = await this.wallet.getAccountAndState(accountId)
        if (has2fa) {
            actions[0].functionCall.gas = GAS_2FA_STAKE
            return this.wallet.signAndSendTransactions([{receiverId, actions}], accountId)
        }
        return account.signAndSendTransaction(receiverId, actions)
    }
}

/********************************
WIP Explorer API calls
********************************/


async function getStakingTransactions(accountId, validators) {
    const methods = ['deposit', 'deposit_and_stake', 'withdraw', 'withdraw_all']

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
            transactions.signer_id = :accountId
            AND
            (
                (
                    json_extract(actions.action_args, '$.method_name') in (:methods)
                    AND
                    transactions.receiver_id in (:validators)
                )
            )   
        ORDER BY 
            block_timestamp DESC
        LIMIT 
            :offset, :count
    `

//  WIP for multisig
//                 (
//                     json_extract(actions.action_args, '$.method_name') = 'add_request_and_confirm'
//                     AND
//                     json_extract(actions.action_args, '$.request.actions.method_name') like '%stake'
//                     AND
//                     json_extract(actions.action_args, '$.request.receiver_id') in (:validators)
//                 )

    const params = {
        accountId, 
        offset: 0, 
        count: 500,
        methods,
        validators,
    }

    const tx = await queryExplorer(sql, params)
    console.log(tx)
    return Array.isArray(tx) ? tx : []
}
