import * as nearApiJs from 'near-api-js'
import BN from 'bn.js'
import { toNear, nearTo, gtZero } from './amounts'
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

const testLockupMapping = {
    'multisig.testnet': 'matt2.lockup.m0',
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

    async getValidatorInstance(account, validatorName) {
        return await new nearApiJs.Contract(account, validatorName, { ...stakingMethods })
    }

    // TODO 
    // viewMethods: pending withdraw, available for withdraw
    // changeMethods: unstake, withdraw_all

    async getValidators() {
        const accountId = this.wallet.accountId
        const lockupId = testLockupMapping[accountId] ? testLockupMapping[accountId] : await getLockupId(accountId)
        const accounts = [accountId, lockupId]
        const res = await this.provider.validators()
        const account = this.wallet.getAccount()
        const validatorIds = res.current_validators.map((v) => v.account_id)

        // WIP needs 2FA - Explorer staking txs for historical stake
        const stakingTxs = [] //await getStakingTransactions(accountId)
        
        const validators = []
        const zero = new BN('0', 10)
        let totalStaked = new BN('0', 10);
        let totalUnclaimedRewards = new BN('0', 10);
        await Promise.all(validatorIds.map((name) => (async () => {
            const validator = {
                name,
                contract: await this.getValidatorInstance(account, name)
            }
            try {
                const fee = validator.fee = await validator.contract.get_reward_fee_fraction()
                fee.percentage = fee.numerator / fee.denominator * 100
                // add all account x validator sums
                let totalBalance = new BN('0', 10)
                let stakedBalance = new BN('0', 10)
                let unstakedBalance = new BN('0', 10)
                await Promise.all(accounts.map((account_id) => (async () => {
                    const balance = new BN(await validator.contract.get_account_total_balance({ account_id }), 10)
                    if (balance.gt(zero)) {
                        totalBalance = totalBalance.add(balance)
                        stakedBalance = stakedBalance.add(new BN(await validator.contract.get_account_staked_balance({ account_id }), 10))
                        unstakedBalance = unstakedBalance.add(new BN(await validator.contract.get_account_unstaked_balance({ account_id }), 10))
                        validator[`unstakedAvailable_${account_id}`] = await validator.contract.is_account_unstaked_balance_available({ account_id })
                    }
                })()))
                validator.totalBalance = totalBalance.toString()
                validator.stakedBalance = stakedBalance.toString()
                validator.unstakedBalance = unstakedBalance.toString()
                totalStaked = totalStaked.add(stakedBalance)
                // calc principle stake from txs
                let principleStaked = new BN('0', 10)
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
                validator.principleStaked = principleStaked.toString()
                // WIP unclaimedRewards relies on indexer
                let unclaimedRewards = totalBalance.sub(principleStaked)
                unclaimedRewards = zero
                // END WIP
                validator.unclaimedRewards = unclaimedRewards.toString()
                totalUnclaimedRewards = totalUnclaimedRewards.add(unclaimedRewards)
                //debugging
                validator.stake = async () => {
                    const amount = window.prompt('how much')
                    const res = await this.stake(validator.name, amount)
                    console.log(res)
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
        amount = toNear(amount)
        let receiverId = validatorId

        // TODO how to choose lockup or not?
        // TODO remove and use deterministic lockup name
        const useLockup = false // window.confirm('use lockup?')
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


// async function getStakingTransactions(accountId) {
//     if (!accountId) return {}
//     const sql = `
//         SELECT
//             transactions.hash, 
//             transactions.signer_id,
//             transactions.receiver_id,
//             transactions.block_timestamp, 
//             actions.action_type as kind, 
//             actions.action_args as args
//         FROM 
//             transactions
//         LEFT JOIN actions ON actions.transaction_hash = transactions.hash
//         WHERE 
//             transactions.signer_id = :accountId
//             AND
//             (
//                 (
//                     json_extract(actions.action_args, '$.method_name') like '%stake'
//                     AND
//                     transactions.receiver_id in (:validators)
//                 )
//                 OR
//                 (
//                     json_extract(actions.action_args, '$.method_name') = 'add_request_and_confirm'
//                     AND
//                     json_extract(actions.action_args, '$.request.actions.method_name') like '%stake'
//                     AND
//                     json_extract(actions.action_args, '$.request.receiver_id') in (:validators)
//                 )
//             )   
//         ORDER BY 
//             block_timestamp DESC
//         LIMIT 
//             :offset, :count
//     `
//     const params = {
//         accountId, 
//         offset: 0, 
//         count: 100,
//         validators: ['alexandruast.pool.f863973.m0', 'aquarius.pool.f863973.m0']
//     }

//     const tx = await queryExplorer(sql, params)

//     return Array.isArray(tx) ? tx : []
// }