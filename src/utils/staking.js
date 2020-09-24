import * as nearApiJs from 'near-api-js'
import { toNear, gtZero } from './amounts'
import { queryExplorer } from './explorer-api'

const {
    transactions: {
        functionCall
    }
} =  nearApiJs
const GAS_STAKE = '200000000000000' // 200 Tgas
const GAS_2FA_STAKE = '80000000000000' // 80 Tgas
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
		'withdraw',
		'stake',
		'unstake',
	],
}
const lockupMethods = {
    viewMethods: ['get_staking_pool_account_id']
}

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
        this.provider = wallet.connection.provider
        this.validators = []

        // window.staking = this
        // window.wallet = this.wallet
        // window.nearApiJs = nearApiJs

        // debugging
        this.getValidators()
    }

    async getValidatorInstance(account, validatorName) {
        return await new nearApiJs.Contract(account, validatorName, { ...stakingMethods })
    }

    async getValidators() {
        const account_id = this.wallet.accountId
        const res = await this.provider.validators()
        const account = this.wallet.getAccount()
        // const stakingTxs = await getStakingTransactions(this.wallet.accountId)
        // const validatorIdsStaked = stakingTxs.map((tx) => tx.receiver_id)
        const validatorIds = res.current_validators.map((v) => v.account_id)
            // .filter((v) => validatorIdsStaked.includes(v))
            // console.log('validatorIds', validatorIds)
        for (validator of validatorIds) {
            const validator = {
                name: validator,
                contract: await this.getValidatorInstance(account, validator)
            }
            try {
                const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                fee.percentage = fee.numerator / fee.denominator * 100

                // TODO add more of the view methods, unstaked balance and rewards
                validator.totalBalance = await validator.contract.get_account_total_balance({ account_id })
                if (gtZero(validator.totalBalance)) {
                    validator.stakedBalance = await validator.contract.get_account_staked_balance({ account_id })
                    validator.unstakedBalance = await validator.contract.get_account_unstaked_balance({ account_id })
                    validator.accounts = await validator.contract.get_accounts({ from_index: 0, limit: 100 })
                }

                //debugging
                validator.stake = async () => {
                    const amount = window.prompt('how much')
                    const res = await this.stake(validator.name, amount)
                    console.log(res)
                }
                
                this.validators.push(validator)
            } catch (e) {
                console.warn(e)
            }
        }

        // filter if 
        console.log(this.validators)
        return this.validators
    }


    async stake(validatorId, amount) {
        amount = toNear(amount)
        let receiverId = validatorId

        // TODO how to choose lockup or not?
        // TODO remove and use deterministic lockup name
        const useLockup = window.confirm('use lockup?')
        const lockupId = 'matt2.lockup.m0' // only can be controlled by multisig.testnet

        // create actions
        const actions = []
        if (useLockup) {
            const selectedValidatorId = await this.getSelectedValidator(lockupId)
            console.log('selectedValidatorId', selectedValidatorId)
            if (validatorId !== selectedValidatorId) {
                await this.selectValidator(validatorId, lockupId)
            }
            actions.push(functionCall('deposit_and_stake', { amount }, GAS_STAKE))
            receiverId = lockupId
        } else {
            actions.push(functionCall('deposit_and_stake', {}, GAS_STAKE, amount))
        }
        const res = await this.signAndSendTransaction(receiverId, actions)
        console.log('deposit_and_stake', res)
        return res
    }

    // helpers for lockup

    async selectValidator(validatorId, lockupId) {
        try {
            const unselect_staking_pool = await this.signAndSendTransaction(lockupId, [
                functionCall('unselect_staking_pool', {}, GAS_STAKE)
            ])
            console.log('unselect_staking_pool', unselect_staking_pool)
        } catch (e) {
            // error "There is still a deposit on the staking pool"
            console.warn('Problem unselecting validator', validatorId, e)
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

    async getSelectedValidator(lockupId) {
        const account_id = this.wallet.accountId
        const account = this.wallet.getAccount(account_id)
        const lockup = await new nearApiJs.Contract(account, lockupId, { ...lockupMethods })
        return await lockup.get_staking_pool_account_id()
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

async function getStakingTransactions(accountId) {
    if (!accountId) return {}
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
                    json_extract(actions.action_args, '$.method_name') like '%stake'
                    AND
                    transactions.receiver_id in (:validators)
                )
                OR
                (
                    json_extract(actions.action_args, '$.method_name') = 'add_request_and_confirm'
                    AND
                    json_extract(actions.action_args, '$.request.actions.method_name') like '%stake'
                    AND
                    json_extract(actions.action_args, '$.request.receiver_id') in (:validators)
                )
            )   
        ORDER BY 
            block_timestamp DESC
        LIMIT 
            :offset, :count
    `
    const params = {
        accountId, 
        offset: 0, 
        count: 100,
        validators: ['alexandruast.pool.f863973.m0', 'aquarius.pool.f863973.m0']
    }

    const tx = await queryExplorer(sql, params)

    return Array.isArray(tx) ? tx : []
}