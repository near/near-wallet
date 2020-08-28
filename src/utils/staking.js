import * as nearApiJs from 'near-api-js'

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

        window.staking = this
        window.wallet = this.wallet
        window.nearApiJs = nearApiJs
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

    async stake() {
        const { functionCall } = nearAPI.transactions
        const actions = []
        if (gtZero(depositAmount)) {
            actions.push(functionCall('deposit', new Uint8Array(), BOATLOAD_OF_GAS, depositAmount))
        }
        actions.push(functionCall('stake', new TextEncoder().encode(JSON.stringify({amount})), BOATLOAD_OF_GAS))
        const account = walletConnection.account()
        account.signAndSendTransaction(selectedContract, actions)

    }
}