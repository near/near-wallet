import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import Tooltip from '../../../../components/common/Tooltip';
import Amount from '../../../../components/send/components/entry_types/Amount';
import StyledContainer from '../../../../components/send/components/entry_types/css/Style.css';
import CONFIG from '../../../../config';
import { useSwapData } from '../../model/Swap';
import PriceImpact from '../PriceImpact';
import SlippagePicker from './SlippagePicker';

const RowWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    color: #72727a;

    span {
        display: flex;
    }

    .tooltip {
        width: 0.938rem;
    }
`;

const SwapFeeDetails = styled.div`
    display: flex;
    flex-wrap: wrap;

    span:not(:first-child) {
        margin-left: 0.3rem;
    }
`;

const slippageMarks = [0.5, 1, 3];

export default function FtSwapDetails({
    minAmountOut,
    swapFeeAmount,
    estimatedFee,
}) {
    const {
        swapState: { tokenIn, tokenOut, swapFee, priceImpactPercent, slippage },
        events: { setSlippage },
    } = useSwapData();

    return (
        <>
            <SlippagePicker
                className='detailsRow'
                value={slippage}
                setSlippage={setSlippage}
                marks={slippageMarks}
            />
            <RowWrapper className='detailsRow'>
                <span>
                    <Translate id='swap.priceImpact' />
                    <Tooltip translate='swap.translateIdInfoTooltip.priceImpact' />
                </span>
                <PriceImpact percent={priceImpactPercent || 0} />
            </RowWrapper>

            {swapFee ? (
                <RowWrapper className='detailsRow'>
                    <span>
                        <Translate id='swap.swapFee' />
                        <Tooltip translate='swap.translateIdInfoTooltip.swapFee' />
                    </span>
                    <SwapFeeDetails>
                        <span>{swapFee} %</span>
                        {swapFeeAmount ? (
                            <span>
                                / {swapFeeAmount}{' '}
                                {tokenIn.onChainFTMetadata?.symbol}
                            </span>
                        ) : (
                            ''
                        )}
                    </SwapFeeDetails>
                </RowWrapper>
            ) : null}

            {estimatedFee ? (
                <Amount
                    className='detailsRow'
                    translateIdTitle='swap.fee'
                    amount={estimatedFee}
                    symbol={CONFIG.NEAR_ID}
                    decimals={0}
                    translateIdInfoTooltip='swap.translateIdInfoTooltip.fee'
                    isApproximate
                />
            ) : null}

            <StyledContainer className="detailsRow">
                <Translate id="swap.minReceived" />
                <Tooltip translate="swap.translateIdInfoTooltip.minimumReceived" />

                <div className='amount'>
                    {minAmountOut || '-'} {tokenOut?.onChainFTMetadata?.symbol}
                </div>
            </StyledContainer>
        </>
    );
}
