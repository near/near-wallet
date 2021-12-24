import React, { useState } from 'react';
import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from './AccordionTrigger';
import Breakdown from './css/Breakdown.css';
import Amount from './Amount';


const prefixTXEntryTitledId = (key) => `wrapNear.review.TxEntry.title.${key}`;

const TransactionDetails = ({ selectedToken,
    estimatedFeesInNear, estimatedTotalInNear, amount }) => {

    const [open, setOpen] = useState(false);

    return (
        <Breakdown className={classNames(['transaction-details-breakdown', open ? 'open' : ''])}>


            <Accordion
                trigger='transaction-details-breakdown'
                className='breakdown'
            >
                <Amount
                    translateIdTitle={prefixTXEntryTitledId('estimatedFees')}
                    amount={estimatedFeesInNear}
                    symbol='NEAR'
                    translateIdInfoTooltip='wrapNear.translateIdInfoTooltip.estimatedFees'
                />
                {selectedToken.symbol === 'NEAR' ?
                    /* Show 'Estimated total' (amount + fees) when sending NEAR only */
                    <Amount
                        translateIdTitle={prefixTXEntryTitledId('estimatedTotal')}
                        amount={estimatedTotalInNear}
                        symbol='NEAR'
                        translateIdInfoTooltip='wrapNear.translateIdInfoTooltip.estimatedTotal'
                    />
                    :
                    /* Show 'Amount' when sending non-NEAR token only */
                    <Amount
                        translateIdTitle={prefixTXEntryTitledId('amount')}
                        amount={amount}
                        symbol={selectedToken.symbol}
                        decimals={selectedToken.decimals}
                    />
                }
            </Accordion>
            <AccordionTrigger
                id='transaction-details-breakdown'
                translateIdTitle='wrapNear.accordionTriggerTitle.transactionDetails'
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default TransactionDetails;