import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from '../../send/components/AccordionTrigger';
import Breakdown from '../../send/components/css/Breakdown.css';
import Amount from '../../send/components/entry_types/Amount';

const TransactionDetails = ({
    selectedTokenFrom,
    selectedTokenTo,
    estimatedFeesInNear,
    estimatedMinReceived,
    amount,
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
                <Amount
                    className="details-info"
                    translateIdTitle={'swapNear.minReceived'}
                    amount={estimatedMinReceived}
                    symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                    decimals={selectedTokenTo.onChainFTMetadata?.decimals}
                    translateIdInfoTooltip="swapNear.translateIdInfoTooltip.minimumReceived"
                />

                <Amount
                    className="green details-info"
                    translateIdTitle={'swapNear.priceImpact'}
                    amount={estimatedFeesInNear}
                    symbol={'%'}
                    decimals={selectedTokenFrom.onChainFTMetadata?.decimals}
                    translateIdInfoTooltip="swapNear.translateIdInfoTooltip.priceImpact"
                />

                <Amount
                    className="details-info"
                    translateIdTitle={'swapNear.fee'}
                    amount={estimatedFeesInNear}
                    symbol="NEAR"
                    translateIdInfoTooltip="swapNear.translateIdInfoTooltip.liquidityProviderFee"
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

export default TransactionDetails;
