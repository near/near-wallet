import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { ACCOUNT_HELPER_URL, wallet } from './wallet';

const {
    utils: {
        format: {
            parseNearAmount
        }
    }
} = nearApiJs;

export const STAKING_AMOUNT_DEVIATION = parseNearAmount('0.00001');

const STAKE_VALIDATOR_PREFIX = '__SVPRE__';
export const ZERO = new BN('0');
export const MIN_DISPLAY_YOCTO = new BN('100');
export const EXPLORER_DELAY = 2000;
export const MIN_LOCKUP_AMOUNT = new BN(process.env.MIN_LOCKUP_AMOUNT || parseNearAmount('35.00001'));
export const STAKING_GAS_BASE = process.env.REACT_APP_STAKING_GAS_BASE || '25000000000000'; // 25 Tgas

export const ACCOUNT_DEFAULTS = {
    selectedValidator: '',
    totalPending: '0', // pending withdrawal
    totalAvailable: '0', // available for withdrawal
    totalUnstaked: '0', // available to be staked
    totalStaked: '0', 
    totalUnclaimed: '0', // total rewards paid out - staking deposits made
    validators: [],
};

export const stakingMethods = {
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
        'stake_all',
        'unstake',
        'withdraw',
    ],
};

export const lockupMethods = {
    viewMethods: [
        'get_balance',
        'get_locked_amount',
        'get_owners_balance',
        'get_staking_pool_account_id',
        'get_known_deposited_balance',
    ]
};

export async function signAndSendTransaction(receiverId, actions) {
    return (await wallet.getAccount(wallet.accountId)).signAndSendTransaction(receiverId, actions);
}

export async function updateStakedBalance(validatorId, account_id, contract) {
    const lastStakedBalance = await contract.get_account_staked_balance({ account_id });
    localStorage.setItem(STAKE_VALIDATOR_PREFIX + validatorId + account_id, lastStakedBalance);
}

export async function getStakingDeposits(accountId) {
    let stakingDeposits = await fetch(ACCOUNT_HELPER_URL + '/staking-deposits/' + accountId).then((r) => r.json()); 

    const validatorDepositMap = {};
    stakingDeposits.forEach(({ validator_id, deposit }) => {
        validatorDepositMap[validator_id] = deposit;
    });
    
    return validatorDepositMap;
}

export function shuffle(sourceArray) {
    for (let i = 0; i < sourceArray.length - 1; i++) {
        const j = i + Math.floor(Math.random() * (sourceArray.length - i));
        const temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}
