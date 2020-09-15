import * as nearApiJs from 'near-api-js'
import { toNear, gtZero, BOATLOAD_OF_GAS } from './amounts'


import { queryExplorer } from './explorer-api'


export async function getStakingTransactions(accountId) {
    if (!accountId) return {}

    const sql = `
        SELECT
            transactions.hash, 
            transactions.signer_id,
            transactions.block_timestamp, 
            actions.action_type as kind, 
            actions.action_args as args,
            actions.action_args::json->>'method_name' as method_name
        FROM 
            transactions
        LEFT JOIN actions ON actions.transaction_hash = transactions.hash
        WHERE 
            transactions.signer_id = :accountId
        ORDER BY 
            block_timestamp DESC
        LIMIT 
            :offset, :count
    `

    const params = {
        accountId, 
        offset: 0, 
        count: 5
    }

    const tx = await queryExplorer(sql, params)

    console.log(tx)
}

getStakingTransactions('za5.testnet')



const GAS_STAKE = '40000000000000'


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
        const validatorIds = res.current_validators.map((v) => v.account_id)
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

    async stake(receiverId, amount) {
        const { functionCall } = nearApiJs.transactions
        amount = toNear(amount)

        const account_id = this.wallet.accountId
        const { account, has2fa } = await this.wallet.getAccountAndState(account_id)

        if (has2fa) {
            const actions = [functionCall('deposit_and_stake', {}, GAS_STAKE, amount)]
            const res = this.wallet.twoFactor.signAndSendTransactions(account, [{receiverId, actions}])
            console.log(res)
            return res
        }

        const contract = await new nearApiJs.Contract(account, receiverId, {
            ...stakingMethods,
            sender: account_id
        })
        try {
            const res = await contract.deposit_and_stake({}, GAS_STAKE, amount)
            console.log(res)
        } catch (e) {
            console.warn(e)
        }
    }
}