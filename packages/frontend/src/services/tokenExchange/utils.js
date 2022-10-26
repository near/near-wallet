import Big from 'big.js';

import {
    parseTokenAmount,
    formatTokenAmount,
    removeTrailingZeros,
} from '../../utils/amounts';
import { MAX_PERCENTAGE } from '../../utils/constants';
import { retryRequestIfFailed } from '../../utils/request';
import { FEE_DIVISOR } from './constants';

const localCache = {};

const fetchTopPools = (indexer) => async () =>
    await fetch(`${indexer}/list-top-pools`).then((res) => res.json());

export const getTopPoolIds = async ({ indexerAddress, minTvl }) => {
    if (localCache.topPoolIds) {
        return localCache.topPoolIds;
    }

    const poolIds = new Set();

    try {
        const allPools = await retryRequestIfFailed(fetchTopPools(indexerAddress), {
            attempts: 3,
        });

        if (!allPools) {
            return;
        }

        allPools.forEach(({ id, tvl }) => {
            if (Number(tvl) >= minTvl) {
                poolIds.add(Number(id));
            }
        });
        localCache.topPoolIds = poolIds;

        return poolIds;
    } catch (error) {
        console.error('Error on fetching top pools', error);
    }
};

// Calculate fee multiplier relative to 100%
// Examples:
// input amount is 5
// 1% fee = fee (1) and fee divisor (100) -> 0.99 multiplier -> amount with fee is 4.95
// 5% (5) and fee divisor (100) -> 0.95 multiplier -> amount with fee is 4.75
// 3% (30) and fee divisor (1_000) -> 0.97 multiplier -> amount with fee is 4.85
// 0.3% (30) and fee divisor (10_000) -> 0.985 multiplier -> amount with fee is 4.985
export const getFeeMultiplier = (fee) => {
    if (fee <= 0) {
        return '1';
    }

    if (fee > FEE_DIVISOR) {
        return '0';
    }

    return Big(1).minus(Big(fee).div(FEE_DIVISOR)).toFixed();
};

// Transform to usual percent notation relative to 100%
export const formatTotalFeePercent = (fee) => {
    if (fee <= 0) {
        return '0';
    }

    if (fee > FEE_DIVISOR) {
        return '100';
    }

    return Big(fee).div(FEE_DIVISOR).times(MAX_PERCENTAGE).toFixed();
};

/**
 * amount IN with fee = amount IN * (FEE_DIVISOR - pool swap fee)
 *
 *
 *                      <amount IN with fee> * <output token reserve>
 * Output amount = ------------------------------------------------------
 *                 FEE_DIVISOR * <input token reserve> + <amount IN with fee>
 *
 */
export const getAmountOut = ({
    pool,
    tokenInId,
    tokenInDecimals,
    amountIn,
    tokenOutId,
    tokenOutDecimals,
}) => {
    const { total_fee, token_account_ids, amounts } = pool;
    const tokenReserve = {
        [token_account_ids[0]]: amounts[0],
        [token_account_ids[1]]: amounts[1],
    };

    try {
        const reserveIn = tokenReserve[tokenInId];
        const reserveOut = tokenReserve[tokenOutId];
        const amountInWithFee =
            parseTokenAmount(amountIn, tokenInDecimals) * (FEE_DIVISOR - total_fee);

        const amountOut =
            (amountInWithFee * reserveOut) / (FEE_DIVISOR * reserveIn + amountInWithFee);

        return formatTokenAmount(amountOut, tokenOutDecimals, tokenOutDecimals);
    } catch (error) {
        console.error('Error in output amount calculation', error);
        return '';
    }
};

export const findBestSwapPool = ({ poolsByIds, ...restParams }) => {
    let bestPool;
    let bestAmountOut;

    Object.values(poolsByIds).forEach((pool) => {
        const amountOut = getAmountOut({
            pool,
            ...restParams,
        });

        if (!bestPool || amountOut > bestAmountOut) {
            bestPool = pool;
            bestAmountOut = amountOut;
        }
    });

    return { pool: bestPool, amountOut: bestAmountOut };
};

/**
 *
 *                   new market price - current market price
 * Price impact % =  --------------------------------------- * 100 %
 *                            new market price
 *
 */
export const getPriceImpactPercent = ({
    pool,
    tokenInId,
    tokenInDecimals,
    amountIn,
    tokenOutId,
    tokenOutDecimals,
}) => {
    const { token_account_ids, amounts, total_fee = 0 } = pool;
    const tokenReserve = {
        [token_account_ids[0]]: amounts[0],
        [token_account_ids[1]]: amounts[1],
    };

    try {
        const reserveIn = formatTokenAmount(
            tokenReserve[tokenInId],
            tokenInDecimals,
            tokenInDecimals
        );
        const reserveOut = formatTokenAmount(
            tokenReserve[tokenOutId],
            tokenOutDecimals,
            tokenOutDecimals
        );

        const constantProduct = Big(reserveIn).times(reserveOut);
        const currentMarketPrice = Big(reserveIn).div(reserveOut);
        const amountInWithFee = Big(amountIn).times(getFeeMultiplier(total_fee));

        const newReserveIn = Big(reserveIn).plus(amountInWithFee);
        const newReserveOut = constantProduct.div(newReserveIn);

        const amountOut = Big(reserveOut).minus(newReserveOut);
        const newMarketPrice = Big(amountInWithFee).div(amountOut);

        const priceImpact = newMarketPrice
            .minus(currentMarketPrice)
            .div(newMarketPrice)
            .times(MAX_PERCENTAGE)
            .toFixed(2);

        return removeTrailingZeros(priceImpact);
    } catch (error) {
        console.error('Error in price impact calculation', error);
        return '';
    }
};
