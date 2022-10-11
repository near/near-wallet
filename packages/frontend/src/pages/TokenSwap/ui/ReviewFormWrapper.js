import React, { useEffect, useState } from 'react';

import { SwapReviewForm } from '../../../components/swap/components/SwapReviewForm';
import { useSwapData } from '../model/Swap';
import { getSwapCost } from '../utils/calculations';

// This component is only for fetching the gas price during rendering.
// 1. we don't need to do this request from the swap form component
// 2. for swap details we use a component from the different dir and do not want changes there
export default function ReviewFormWrapper(formProps) {
    const {
        swapState: { tokenIn, tokenOut },
    } = useSwapData();

    const [estimatedFee, setEstimatedFee] = useState('');

    useEffect(() => {
        const fetch = async () => {
            const fee = await getSwapCost(tokenIn, tokenOut);

            setEstimatedFee(fee);
        };

        fetch();
    }, []);

    return (
        <SwapReviewForm estimatedFee={estimatedFee} {...formProps} />
    );
}
