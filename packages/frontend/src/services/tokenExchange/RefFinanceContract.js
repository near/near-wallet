import * as nearApi from 'near-api-js';

import { REF_FINANCE_CONTRACT, REF_FINANCE_API_ENDPOINT, TOKEN_TRANSFER_DEPOSIT } from '../../config';
import { parseTokenAmount } from '../../utils/amounts';
import { ERROR_MESSAGES } from './constants';
import {
    findBestSwapPool,
    formatTotalFeePercent,
    getPriceImpactPercent,
    getTopPoolIds,
} from './utils';

const refConfig = {
    errorRegExp: /[A-Z][0-9]+: ?[a-zA-Z0-9_$\- ]+/,
    contractId: REF_FINANCE_CONTRACT,
    indexerAddress: REF_FINANCE_API_ENDPOINT,
    viewMethods: [
        'get_number_of_pools',
        'get_pools',
        'get_pool',
        'get_return',
    ],
    changeMethods: [
        'swap',
    ],
    gasLimit: {
        swap: '180000000000000',
    },
    pools: {
        minimumTvlRequired: 1_000, // amount in USD
        startIndex: 0,
        // Max amount of pools in one request.
        // If we try to get more than +-1600 items at one point we
        // obtain a error: FunctionCallError(HostError(GasLimitExceeded))
        maxRequestAmount: 1000,
    }
};

const DEV_CONTRACT_ID_REGEXP = /dev-[0-9]+-[0-9]+/;

class RefFinanceContract {
    async getData({ account }) {
        const { maxRequestAmount } = refConfig.pools;
        const contract = await this._newContract(account);
        const totalNumberOfPools = await contract.get_number_of_pools();
        const pools = [];

        let numberOfRequests =
            totalNumberOfPools <= maxRequestAmount
                ? 1
                : Math.floor(totalNumberOfPools / maxRequestAmount);
        const remaningNumberOfPools = totalNumberOfPools - numberOfRequests * maxRequestAmount;

        if (remaningNumberOfPools) {
            numberOfRequests += 1;
        }

        for (let req = 1; req <= numberOfRequests; req++) {
            let startPoolsIndex = (req * maxRequestAmount) - maxRequestAmount;
            let poolsAmountLimit = maxRequestAmount;

            if (req === numberOfRequests && remaningNumberOfPools) {
                poolsAmountLimit = remaningNumberOfPools;
            }

            try {
                const chunk = await contract.get_pools({
                    from_index: startPoolsIndex,
                    limit: poolsAmountLimit,
                });

                pools.push(...chunk);
            } catch (error) {
                console.error(
                    'RefFinanceContract: Error in the request for a part of pools',
                    error
                );
                // It makes no sense to continue fetching, because the pool IDs are array indexes,
                // if any of the chunks (except the last one) isn't fetched, we will have incorrect IDs.
                break;
            }
        }

        return this._formatPoolsData(pools);
    }

    async estimate({
        poolsByIds,
        tokenInId,
        tokenInDecimals,
        amountIn,
        tokenOutId,
        tokenOutDecimals,
    }) {
        if (!Object.keys(poolsByIds).keys) {
            return {};
        }

        const commonParams = {
            tokenInId,
            tokenInDecimals,
            amountIn,
            tokenOutId,
            tokenOutDecimals,
        };

        const { pool, amountOut } = findBestSwapPool({
            poolsByIds,
            ...commonParams,
        });
        const { poolId, total_fee } = pool;

        return {
            poolId,
            amountOut,
            swapFee: formatTotalFeePercent(total_fee),
            priceImpactPercent: getPriceImpactPercent({ pool, ...commonParams }),
        };
    }

    async getSwapActions({
        poolId,
        tokenInId,
        tokenInDecimals,
        amountIn,
        tokenOutId,
        tokenOutDecimals,
        minAmountOut,
    }) {
        const actions = [];
        const parsedAmountIn = parseTokenAmount(amountIn, tokenInDecimals);
        const parsedMinAmountOut = parseTokenAmount(minAmountOut, tokenOutDecimals);

        actions.push(
            nearApi.transactions.functionCall(
                'ft_transfer_call',
                {
                    receiver_id: refConfig.contractId,
                    amount: parsedAmountIn,
                    msg: JSON.stringify({
                        actions: [
                            // @note in case of multihop swaps we add extra objects here
                            {
                                pool_id: poolId,
                                token_in: tokenInId,
                                token_out: tokenOutId,
                                amount_in: parsedAmountIn,
                                min_amount_out: parsedMinAmountOut,
                            },
                        ],
                    }),
                },
                refConfig.gasLimit.swap,
                TOKEN_TRANSFER_DEPOSIT,
            ),
        );

        return actions;
    }

    extractErrorMessage(data) {
        if (!data || !refConfig.errorRegExp) {
            return '';
        }

        try {
            const sourceMsg = JSON.stringify(data).match(refConfig.errorRegExp);

            return ERROR_MESSAGES[sourceMsg] || sourceMsg;
        } catch (error) {
            console.error('Error on getting error message', error);
        }

        return '';
    }

    async _formatPoolsData(inputPools) {
        const pools = {};
        const tokens = new Set();
        const topPoolIds = await getTopPoolIds({
            indexerAddress: refConfig.indexerAddress,
            minTvl: refConfig.pools.minimumTvlRequired,
        });

        inputPools.forEach((pool, poolId) => {
            if (topPoolIds && !topPoolIds.has(poolId)) {
                return;
            }

            const { token_account_ids, shares_total_supply, amounts  } = pool;
            const hasLiquidity = parseInt(shares_total_supply) > 0 && !amounts.includes('0');
            let mainKey = '';

            try {
                mainKey = JSON.stringify(token_account_ids);
            } catch (error) {
                console.error('Error on stringify token_account_ids', error);
                return;
            }

            if (hasLiquidity && !mainKey.match(DEV_CONTRACT_ID_REGEXP)) {
                tokens.add(token_account_ids[0]);
                tokens.add(token_account_ids[1]);

                const reverseKey = JSON.stringify(token_account_ids.reverse());

                if (!pools[mainKey]) {
                    pools[mainKey] = {};
                }
                // Some pools have reverse order of the same tokens.
                // In this condition we check if we already have
                // such tokens and use an existing pools key.
                if (pools[reverseKey] && Object.keys(pools[reverseKey])?.length > 0) {
                    mainKey = reverseKey;
                }

                pools[mainKey][poolId] = {
                    // Set before the "...pool": if the pool has own 'poolId' key it will be rewritten
                    poolId,
                    ...pool,
                    // We receive the wrong order of token IDs relative to amounts.
                    // Reverse it to be able to match it using array indexes.
                    // Create a new array in order not to change the original token_account_ids
                    token_account_ids: [...token_account_ids].reverse(),
                };
            }
        });

        return { pools, tokens: [...tokens] };
    }

    async _newContract(account) {
        return new nearApi.Contract(
            account,
            refConfig.contractId,
            refConfig
        );
    }
}

export default new RefFinanceContract();
