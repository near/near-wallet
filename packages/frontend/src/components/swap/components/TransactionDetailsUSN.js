import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { NEAR_ID, NEAR_DECIMALS } from '../../../config';
import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import Tooltip from '../../common/Tooltip';
import AccordionTrigger from '../../send/components/AccordionTrigger';
import Breakdown from '../../send/components/css/Breakdown.css';
import Amount from '../../send/components/entry_types/Amount';
import SlippagePicker from './SlippagePicker';

const RowWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 15px;
    color: #72727A;

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

const TransactionDetailsUSN = ({
    selectedTokenFrom,
    selectedTokenTo,
    minReceivedAmount,
    swapFee,
    swapFeeAmount,
    estimatedFee,
    priceImpactElement,
    setSlippage,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Breakdown
            className={classNames([
                'transaction-details-breakdown',
                open ? 'open' : '',
            ])}
        >
            <Accordion
                trigger="transaction-details-breakdown"
                className="breakdown"
            >
                <SlippagePicker
                    translateIdTitle={'swap.slippage'}
                    translateIdInfoTooltip="swap.translateIdInfoTooltip.slippage"
                    setSlippage={setSlippage}
                />
                {priceImpactElement && (
                    <RowWrapper>
                        <span>
                            <Translate id="swap.priceImpact" />
                            <Tooltip translate="swap.translateIdInfoTooltip.priceImpact" />
                        </span>
                        {priceImpactElement}
                    </RowWrapper>
                )}
                {swapFee && (
                    <RowWrapper>
                        <span>
                            <Translate id="swap.swapFee" />
                            <Tooltip translate="swap.translateIdInfoTooltip.swapFee" />
                        </span>
                        <SwapFeeDetails>
                            <span>
                                {swapFee} %
                            </span>
                            {swapFeeAmount
                                ? <span>/ {swapFeeAmount} {selectedTokenFrom.onChainFTMetadata?.symbol}</span>
                                : ''}
                        </SwapFeeDetails>
                    </RowWrapper>
                )}
                {!!estimatedFee && (
                    <Amount
                        className="details-info"
                        translateIdTitle={'swap.fee'}
                        amount={estimatedFee}
                        symbol={NEAR_ID}
                        decimals={NEAR_DECIMALS}
                        translateIdInfoTooltip="swap.translateIdInfoTooltip.fee"
                        isApproximate
                    />
                )}
                <Amount
                    className="details-info"
                    translateIdTitle={'swap.minReceived'}
                    amount={minReceivedAmount}
                    symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                    decimals={0}
                    translateIdInfoTooltip="swap.translateIdInfoTooltip.minimumReceived"
                />
            </Accordion>
            <AccordionTrigger
                id="transaction-details-breakdown"
                translateIdTitle="sendV2.accordionTriggerTitle.transactionDetails"
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default TransactionDetailsUSN;
