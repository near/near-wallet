import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { toNear, nearTo, gtZero } from './amounts'
import { queryExplorer } from './explorer-api'

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
    'multisig.testnet': 'lu1.testnet', //matt2.lockup.m0
    'xa4.testnet': 'lu3.testnet',
}

const {
    transactions: {
        functionCall
    }
} =  nearApiJs
const GAS_STAKE = '200000000000000' // 200 Tgas
const GAS_2FA_STAKE = '125000000000000' // 125 Tgas for most methods

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
        'get_owners_balance',
        'get_staking_pool_account_id',
        'get_known_deposited_balance',
    ]
}

const getLockupId = async (accountId) => {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(accountId))
    return Buffer.from(hash).toString('hex').substr(0, 40) + '.lockup.near'
}

export class Staking {
    constructor(wallet) {
        this.wallet = wallet
        this.provider = wallet.connection.provider
        // window.staking = this
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

    // TODO 
    // viewMethods: pending withdraw, available for withdraw
    // changeMethods: unstake, withdraw_all

    async getValidators() {
        const accountId = this.wallet.accountId
        const lockupId = testLockup[accountId] ? testLockup[accountId] : await getLockupId(accountId)
        const accounts = [accountId, lockupId]
        const res = await this.provider.validators()
        const validatorIds = res.current_validators.map((v) => v.account_id)

        let selectedValidator = ''
        let depositedBalance = new BN('0', 10)
        let availableBalance = new BN('0', 10)
        const lockupContract = await this.getContractInstance(lockupId, lockupMethods)
        if (lockupContract) {
            depositedBalance = new BN(await lockupContract.get_known_deposited_balance(), 10)
            selectedValidator = await this.lockupGetSelected(lockupId)
            availableBalance = new BN(await lockupContract.get_owners_balance(), 10).sub(depositedBalance).toString()
            // debugging
            console.log('lockup available balance', nearTo(availableBalance))
        }

        // WIP needs 2FA - Explorer staking txs for historical stake
        const stakingTxs = []//await getStakingTransactions(accountId)
        
        const validators = []
        const zero = new BN('0', 10)
        let totalStaked = new BN('0', 10);
        let totalUnclaimedRewards = new BN('0', 10);
        await Promise.all(validatorIds.map((name) => (async () => {
            const validator = {
                name,
                contract: await this.getContractInstance(name, stakingMethods)
            }
            try {
                const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                fee.percentage = fee.numerator / fee.denominator * 100
                let totalBalance = new BN('0', 10)
                let stakedBalance = new BN('0', 10)
                let unstakedBalance = new BN('0', 10)
                for (let i = 0; i < accounts.length; i++) {
                    const account_id = accounts[i]
                    const balance = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
                    if (balance.gt(zero)) {
                        totalBalance = totalBalance.add(balance)
                        stakedBalance = stakedBalance.add(new BN(await validator.contract.get_account_staked_balance({ account_id }), 10))
                        unstakedBalance = unstakedBalance.add(new BN(await validator.contract.get_account_unstaked_balance({ account_id }), 10))
                        validator[`unstakedAvailable_${account_id}`] = await validator.contract.is_account_unstaked_balance_available({ account_id })
                        // console.log('stakedBalance inner', name, account_id, stakedBalance.toString())
                        // console.log('unstakedBalance inner', name, account_id, unstakedBalance.toString())
                    }
                }
                validator.totalBalance = totalBalance.toString()
                validator.stakedBalance = stakedBalance.toString()
                validator.unstakedBalance = unstakedBalance.toString()
                totalStaked = totalStaked.add(stakedBalance)
                // unclaimed rewards
                let principleStaked = new BN('0', 10)
                // if validator is selected lockup validator base principle on depositedBalance
                if (lockupContract && name === selectedValidator) {
                    principleStaked = principleStaked.add(depositedBalance)
                } else 
                // WIP calculate principle staked based on staking txs filtered by this validator
                if (false && stakingTxs) {
                    const validatorTXs = stakingTxs.filter((tx) => tx.receiver_id === validator.name)
                    validatorTXs.forEach((tx) => {
                        const args = JSON.parse(tx.args)
                        if (args.method_name.indexOf('withdraw') > -1) {
                            principleStaked = principleStaked.sub(new BN(args.deposit, 10))
                        }
                        if (args.method_name.indexOf('deposit') > -1) {
                            principleStaked = principleStaked.add(new BN(args.deposit, 10))
                        }
                    })
                }
                // WIP only show unclaimed for lockup RN
                if (name === selectedValidator) {
                    validator.principleStaked = principleStaked.toString()
                    const unclaimedRewards = totalBalance.sub(principleStaked)
                    validator.unclaimedRewards = unclaimedRewards.toString()
                    totalUnclaimedRewards = totalUnclaimedRewards.add(unclaimedRewards)
                }
                
                validators.push(validator)
            } catch (e) {
                console.warn(e)
            }
        })()))

        console.log(validators)

        return {
            validators,
            totalStaked: totalStaked.toString(),
            totalUnclaimedRewards: totalUnclaimedRewards.toString(),
        }
    }


    async stake(validatorId, amount) {
        amount = new BN(toNear(amount), 10)
        const accountId = this.wallet.accountId
        const lockupId = testLockup[accountId] ? testLockup[accountId] : await getLockupId(accountId)
        // try to source funds from lockup contract
        const lockupContract = await this.getContractInstance(lockupId, lockupMethods)
        const lockupBalance = new BN(await lockupContract.get_owners_balance(), 10)
        const useLockup = lockupBalance.gt(amount)
        amount = amount.toString()

        console.log(lockupContract, amount, lockupBalance.toString(), useLockup)

        if (useLockup) {
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
