import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { ACCOUNT_HELPER_URL, NEAR_TOKEN_ID } from '../config';
import { nearTo } from '../utils/amounts';
import { wallet } from './wallet';

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
        'get_farms',
        'get_farm',
        'get_active_farms',
        'get_unclaimed_reward',
        'get_pool_summary',
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
        'claim'
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

export async function signAndSendTransaction(signAndSendTransactionOptions) {
    return (await wallet.getAccount(wallet.accountId)).signAndSendTransaction(signAndSendTransactionOptions);
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

const SECONDS_IN_YEAR = 3600 * 24 * 365;

export const calculateAPY = (poolSummary, tokenPrices) => {
    // Handle if there are no farms:
    const activeFarms = poolSummary?.farms;
    if (!activeFarms) return 0;

    try {

        if (activeFarms.some(farm => !+tokenPrices[farm.token_id]?.usd)) return 0;
        const totalStakedBalance = nearTo(poolSummary.total_staked_balance);

        const summaryAPY = activeFarms.reduce((acc, farm) => {
            const tokenPriceInUSD = +tokenPrices[farm.token_id].usd;
            const nearPriceInUSD = +tokenPrices[NEAR_TOKEN_ID].usd;

            const rewardsPerSecond = farm.amount / ((farm.end_date - farm.start_date) * 1e9);
            const rewardsPerSecondInUSD = rewardsPerSecond * tokenPriceInUSD;
            const totalStakedBalanceInUSD = totalStakedBalance * nearPriceInUSD;
            const farmAPY = rewardsPerSecondInUSD * SECONDS_IN_YEAR / totalStakedBalanceInUSD * 100;
            return acc + farmAPY;
        }, 0);

        return summaryAPY.toFixed(2);
    }
    catch (e) {
        console.error('Error during calculating APY', e);
        return 0;
    }
};
