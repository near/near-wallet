import React, { memo, useEffect } from 'react';

import { NEAR_DECIMALS } from '../../../config';
import useIsMounted from '../../../hooks/useIsMounted';
import { Mixpanel } from '../../../mixpanel';
import {
    toSignificantDecimals,
    formatTokenAmount,
    removeTrailingZeros,
} from '../../../utils/amounts';
import { openTransactionInExplorer } from '../../../utils/window';
import { useSwapData, VIEW_STATE } from '../model/Swap';
import { getMinAmountOut, getSwapCost } from '../utils/calculations';
import { DECIMALS_TO_SAFE } from '../utils/constants';
import useSwap from '../utils/hooks/useSwap';
import Preview from './Preview';
import Success from './Success';
import SwapForm from './SwapForm';

export default memo(function SwapWrapper({ history, account, tokensConfig }) {
    const isMounted = useIsMounted();
    const {
        swapState: {
            viewState,
            tokenIn,
            amountIn,
            tokenOut,
            amountOut,
            swapPoolId,
            slippage,
            isNearTransformation,
            lastSwapState,
            swapPending,
        },
        events: { setViewState, setAmountIn, setEstimatedFee },
    } = useSwapData();

    useEffect(() => {
        const fetch = async () => {
            const fee = await getSwapCost({ account, tokenIn, tokenOut });

            if (isMounted) {
                setEstimatedFee(
                    removeTrailingZeros(
                        formatTokenAmount(fee, NEAR_DECIMALS, NEAR_DECIMALS)
                    )
                );
            }
        };

        fetch();
    }, [tokenIn, tokenOut, isMounted]);

    const goHome = () => history.push('/');
    const showForm = () => setViewState(VIEW_STATE.inputForm);
    const updateForm = () => {
        setAmountIn('');
        setViewState(VIEW_STATE.inputForm);
    };

    const minAmountOut = getMinAmountOut({
        tokenOut,
        amountOut,
        slippage,
    });

    const swap = useSwap({
        account,
        amountIn,
        poolId: swapPoolId,
        tokenIn,
        tokenOut,
        minAmountOut,
        isNearTransformation,
    });

    const handleSwap = () => {
        if (swap) {
            Mixpanel.track('Click Confirm & Swap on Swap page');
            swap();
        }
    };

    const openTransaction = () => {
        if (lastSwapState?.hash) {
            openTransactionInExplorer(lastSwapState.hash);
        }
    };

    const amountInToShow = toSignificantDecimals(amountIn, DECIMALS_TO_SAFE);
    const amountOutToShow = toSignificantDecimals(amountOut, DECIMALS_TO_SAFE);

    return viewState === VIEW_STATE.inputForm ? (
        <SwapForm onGoBack={goHome} account={account} tokensConfig={tokensConfig} />
    ) : viewState === VIEW_STATE.preview ? (
        <Preview
            onClickGoBack={showForm}
            activeTokenFrom={tokenIn}
            amountTokenFrom={amountInToShow}
            activeTokenTo={tokenOut}
            amountTokenTo={amountOutToShow}
            startSwap={handleSwap}
            swappingToken={swapPending}
        />
    ) : viewState === VIEW_STATE.result ? (
        <Success onClickContinue={updateForm} onClickGoToExplorer={openTransaction} />
    ) : null;
});
