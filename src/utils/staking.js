import * as nearApiJs from 'near-api-js'
import { toNear, gtZero, BOATLOAD_OF_GAS } from './amounts'
import { queryExplorer } from './explorer-api'

const { functionCall } = nearApiJs.transactions
const GAS_STAKE = '100000000000000' // 100 Tgas
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

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
        this.provider = wallet.connection.provider
        this.validators = []

        // window.staking = this
        // window.wallet = this.wallet
        // window.nearApiJs = nearApiJs
    }

    async getValidatorInstance(account, validatorName) {
        return await new nearApiJs.Contract(account, validatorName, { ...stakingMethods })
    }

    async getValidators() {
        const res = await this.provider.validators()
        const account = this.wallet.getAccount()
        const stakingTxs = await getStakingTransactions(this.wallet.accountId)
        const validatorIdsStaked = stakingTxs.map((tx) => tx.receiver_id)
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
                this.validators.push(validator)
            } catch (e) {
                console.warn(e)
            }
        }
        return this.validators
    }

    async stake(validatorId, amount) {
        amount = toNear(amount)
        let receiverId = validatorId
        const account_id = this.wallet.accountId
        const { account, has2fa } = await this.wallet.getAccountAndState(account_id)

        const useLockup = window.confirm('use lockup?')
        const lockupId = 'matt2.lockup.m0'

        // create actions
        const actions = []
        if (useLockup) {
            actions.push(
                functionCall('select_staking_pool', { staking_pool_account_id: validatorId }, GAS_STAKE),
                functionCall('deposit_and_stake', { amount }, GAS_STAKE)
            )
            receiverId = lockupId
        } else {
            actions.push(functionCall('deposit_and_stake', {}, GAS_STAKE, amount))
        }
        // complete tx
        let res
        if (has2fa) {
            res = await this.wallet.signAndSendTransactions(account, [{receiverId, actions}])
        } else {
            res = await account.signAndSendTransaction(receiverId, actions)
        }
        console.log(res)
        return res
    }
}

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