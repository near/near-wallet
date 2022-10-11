import Big from 'big.js';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { NEAR_TOKEN_ID } from '../../../../config';
import { Mixpanel } from '../../../../mixpanel';
import { showCustomAlert } from '../../../../redux/actions/status';
import selectNEARAsTokenWithMetadata from '../../../../redux/selectors/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { actions } from '../../../../redux/slices/swap';
import fungibleTokenExchange from '../../../../services/tokenExchange';
import { useSwapData, VIEW_STATE } from '../../model/Swap';

const { updateTokensBalance } = actions;

const getUsdVolume = (amount, usdPrice) => {
    return !amount || typeof usdPrice !== 'number'
        ? 'Unavailable'
        : Big(amount).times(usdPrice).toFixed();
};

const getAmountStats = ({ tokenIn, amountIn, tokenOut, amountOut, nearUsdPrice }) => {
    const tokenInId = fungibleTokenExchange.replaceNearIdIfNecessary(
        tokenIn.contractName
    );
    const tokenOutId = fungibleTokenExchange.replaceNearIdIfNecessary(
        tokenOut.contractName
    );

    if (
        fungibleTokenExchange.isNearTransformation({ tokenIn, tokenOut }) ||
        tokenInId === NEAR_TOKEN_ID
    ) {
        return {
            volumeNear: amountIn,
            volumeUSD: getUsdVolume(amountIn, nearUsdPrice),
        };
    }

    if (tokenOutId === NEAR_TOKEN_ID) {
        return {
            volumeNear: amountOut,
            volumeUSD: getUsdVolume(amountOut, nearUsdPrice),
        };
    }

    return {
        inputAmountUSD: getUsdVolume(amountIn, tokenIn.fiatValueMetadata.usd),
    };
};

export default function useSwap({
    account,
    amountIn,
    poolId,
    tokenIn,
    tokenOut,
    minAmountOut,
    isNearTransformation,
}) {
    const nearConfig = useSelector((state) =>
        selectNEARAsTokenWithMetadata(state, { includeNearContractName: true })
    );
    const dispatch = useDispatch();
    const {
        events: { setSwapPending, setCompletedSwapState, setViewState },
    } = useSwapData();

    const swap = useMemo(() => {
        if (
            !account ||
            !amountIn ||
            (!isNearTransformation && !poolId) ||
            !tokenIn ||
            !tokenOut ||
            !minAmountOut
        ) {
            return null;
        }

        return async () => {
            setSwapPending(true);

            try {
                const { swapTxHash, success } = await fungibleTokenExchange.swap({
                    account,
                    amountIn,
                    poolId,
                    tokenIn,
                    tokenOut,
                    minAmountOut,
                });

                Mixpanel.track('Swap:done', {
                    tokenFrom: tokenIn.onChainFTMetadata.symbol,
                    tokenFromAddress: tokenIn.contractName,
                    tokenTo: tokenOut.onChainFTMetadata.symbol,
                    tokenToAddress: tokenOut.contractName,
                    ...getAmountStats({
                        tokenIn,
                        amountIn,
                        tokenOut,
                        amountOut: minAmountOut,
                        nearUsdPrice: nearConfig.fiatValueMetadata.usd,
                    }),
                });

                dispatch(
                    updateTokensBalance({
                        accountId: account.accountId,
                        tokenIds: [
                            fungibleTokenExchange.replaceNearIdIfNecessary(
                                tokenIn.contractName
                            ),
                            fungibleTokenExchange.replaceNearIdIfNecessary(
                                tokenOut.contractName
                            ),
                        ],
                    })
                );
                setCompletedSwapState({
                    success,
                    hash: swapTxHash,
                    tokenIn: tokenIn.onChainFTMetadata.symbol,
                    tokenOut: tokenOut.onChainFTMetadata.symbol,
                });
                setViewState(VIEW_STATE.result);
            } catch (error) {
                Mixpanel.track('Swap:failed', {
                    errorMessage: error.message,
                });
                dispatch(
                    showCustomAlert({
                        success: false,
                        messageCodeHeader: 'swap.error',
                        errorMessage: error.message,
                    })
                );
            }

            setSwapPending(false);
        };
    }, [
        dispatch,
        account,
        amountIn,
        poolId,
        tokenIn,
        tokenOut,
        minAmountOut,
        isNearTransformation,
    ]);

    return swap;
}
