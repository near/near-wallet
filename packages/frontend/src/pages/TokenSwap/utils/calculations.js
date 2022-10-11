import { NEAR_ID, NEAR_TOKEN_ID } from '../../../config';
import { decreaseByPercent, getPercentFrom } from '../../../utils/amounts';
import { getTotalGasFee } from '../../../utils/gasPrice';
import { SWAP_GAS_UNITS } from './constants';

export function getCalculatedSwapValues({
    amountIn,
    tokenOut,
    amountOut,
    slippage,
    swapFee,
}) {
    let minAmountOut = '';
    const canCalculateMinAmount =
        typeof slippage === 'number' &&
        tokenOut?.onChainFTMetadata?.decimals &&
        amountOut;

    if (canCalculateMinAmount) {
        minAmountOut = !slippage
            ? amountOut
            : decreaseByPercent(
                amountOut,
                slippage,
                tokenOut.onChainFTMetadata.decimals
            );
    }

    const swapFeeAmount =
        amountIn && swapFee >= 0
            ? Number(getPercentFrom(amountIn, swapFee))
            : 0;

    return { minAmountOut, swapFeeAmount };
}

export async function getSwapCost(tokenIn, tokenOut) {
    const inId = tokenIn?.contractName;
    const outId = tokenOut?.contractName;

    if (!inId || !outId) {
        return '';
    }

    const tokenIds = [inId, outId];

    // swap NEAR <> wNEAR
    if (tokenIds.includes(NEAR_ID) && tokenIds.includes(NEAR_TOKEN_ID)) {
        return getTotalGasFee(SWAP_GAS_UNITS.nearWithWnear);
    }
    // swap NEAR <> NEP141
    if (tokenIds.includes(NEAR_ID)) {
        return getTotalGasFee(SWAP_GAS_UNITS.nearWithFT);
    }
    // swap NEP141 <> NEP141
    return getTotalGasFee(SWAP_GAS_UNITS.ftWithFt);
}
