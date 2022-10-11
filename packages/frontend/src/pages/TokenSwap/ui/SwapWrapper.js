import React, { memo, useState } from 'react';

import Success from '../../../components/swap/components/Success';
import { Mixpanel } from '../../../mixpanel';
import { cutDecimalsIfNeeded } from '../../../utils/amounts';
import { openTransactionInExplorer } from '../../../utils/window';
import { useSwapData, VIEW_STATE } from '../model/Swap';
import { getCalculatedSwapValues } from '../utils/calculations';
import { DECIMALS_TO_SAFE } from '../utils/constants';
import useSwap from '../utils/hooks/useSwap';
import PriceImpact from './PriceImpact';
import ReviewFormWrapper from './ReviewFormWrapper';
import SwapForm from './SwapForm';

export default memo(function SwapWrapper({ history, account, tokensConfig }) {
    const {
        swapState: {
            viewState,
            tokenIn,
            amountIn,
            tokenOut,
            amountOut,
            swapPoolId,
            swapFee,
            priceImpactPercent,
            isNearTransformation,
            lastSwapTxHash,
            swapPending,
        },
        events: { setViewState, setAmountIn },
    } = useSwapData();

    const goHome = () => history.push('/');
    const showForm = () => setViewState(VIEW_STATE.inputForm);
    const updateForm = () => {
        setAmountIn('');
        setViewState(VIEW_STATE.inputForm);
    };

    const [slippage, setSlippage] = useState(0);
    const { minAmountOut, swapFeeAmount } = getCalculatedSwapValues({
        amountIn,
        tokenOut,
        amountOut,
        slippage,
        swapFee,
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
        openTransactionInExplorer(lastSwapTxHash);
    };

    const amountInToShow = cutDecimalsIfNeeded(amountIn, DECIMALS_TO_SAFE);
    const amountOutToShow = cutDecimalsIfNeeded(amountOut, DECIMALS_TO_SAFE);
    const minAmountOutToShow = cutDecimalsIfNeeded(minAmountOut, DECIMALS_TO_SAFE);

    return viewState === VIEW_STATE.inputForm ? (
        <SwapForm
            onGoBack={goHome}
            account={account}
            tokensConfig={tokensConfig}
        />
    ) : viewState === VIEW_STATE.preview ? (
        <ReviewFormWrapper
            onClickGoBack={showForm}
            activeTokenFrom={tokenIn}
            amountTokenFrom={amountInToShow}
            activeTokenTo={tokenOut}
            amountTokenTo={amountOutToShow}
            minReceivedAmount={minAmountOutToShow}
            accountId={account.accountId}
            handleSwapToken={handleSwap}
            swapFee={swapFee}
            swapFeeAmount={swapFeeAmount}
            swappingToken={swapPending}
            setSlippage={setSlippage}
            showAllInfo={!isNearTransformation}
            priceImpactElement={<PriceImpact percent={priceImpactPercent} />}
        />
    ) : viewState === VIEW_STATE.result ? (
        <Success
            // @todo It's not amount fields. We have to rename it.
            amountFrom={`${amountInToShow} ${tokenIn?.onChainFTMetadata?.symbol}`}
            amountTo={`${amountOutToShow} ${tokenOut?.onChainFTMetadata?.symbol}`}
            onClickContinue={updateForm}
            transactionHash={lastSwapTxHash}
            onClickGoToExplorer={openTransaction}
        />
    ) : null;
});
