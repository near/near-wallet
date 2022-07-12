import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from '../../send/components/AccordionTrigger';
import Breakdown from '../../send/components/css/Breakdown.css';
import Amount from '../../send/components/entry_types/Amount';

const TransactionDetailsWrappedNear = ({
    selectedTokenFrom,
    selectedTokenTo,
    estimatedFeesInNear,
    estimatedMinReceived,
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
                    className="green details-info"
                    translateIdTitle={'swap.priceImpact'}
                    amount={estimatedFeesInNear}
                    symbol={'%'}
                    decimals={selectedTokenFrom.onChainFTMetadata?.decimals}
                    translateIdInfoTooltip="swap.translateIdInfoTooltip.priceImpact"
                />
                <Amount
                    className="details-info"
                    translateIdTitle={'swap.fee'}
                    amount={estimatedFeesInNear}
                    symbol="NEAR"
                    translateIdInfoTooltip="swap.translateIdInfoTooltip.fee"
                />
                <Amount
                    className="details-info"
                    translateIdTitle={'swap.minReceived'}
                    amount={estimatedMinReceived}
                    symbol={selectedTokenTo.onChainFTMetadata?.symbol}
                    decimals={selectedTokenTo.onChainFTMetadata?.decimals}
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

export default TransactionDetailsWrappedNear;
