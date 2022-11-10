import React from 'react';

import Amount from '../../../../components/send/components/entry_types/Amount';
import CONFIG from '../../../../config';
import { parseTokenAmount } from '../../../../utils/amounts';
import { useSwapData } from '../../model/Swap';

export default function NearTransformationDetails({
    minAmountOut,
    estimatedFee,
}) {
    const {
        swapState: { tokenOut },
    } = useSwapData();

    return (
        <>
            <Amount
                className='detailsRow'
                translateIdTitle='swap.fee'
                amount={estimatedFee}
                decimals={0}
                symbol={CONFIG.NEAR_ID}
                translateIdInfoTooltip='swap.translateIdInfoTooltip.fee'
            />
            <Amount
                className='detailsRow'
                translateIdTitle='swap.minReceived'
                amount={parseTokenAmount(minAmountOut, CONFIG.NEAR_DECIMALS)}
                symbol={tokenOut?.onChainFTMetadata?.symbol}
                decimals={tokenOut?.onChainFTMetadata?.decimals}
                translateIdInfoTooltip='swap.translateIdInfoTooltip.minimumReceived'
            />
        </>
    );
}
