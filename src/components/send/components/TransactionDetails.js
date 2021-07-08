import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from './AccordionTrigger';
import Breakdown from './css/Breakdown.css';
import Amount from './entry_types/Amount';
import Token from './entry_types/Token';

const prefixTXEntryTitledId = (key) => `sendV2.TXEntry.title.${key}`;

const TransactionDetails = () => {
    const [open, setOpen] = useState(false);
    //TODO: Update tooltip info copy
    return (
        <Breakdown className={classNames(['transaction-details-breakdown' , open ? 'open' : ''])}>
            <Token
                translateIdTitle={prefixTXEntryTitledId('token')}
                symbol='NEAR'
            />
            <Accordion
                trigger='transaction-details-breakdown'
                className='breakdown'
            >
                <Amount
                    translateIdTitle={prefixTXEntryTitledId('estimatedFees')}
                    amount='500000000000000000000'
                    translateIdInfoTooltip='profile.security.mostSecureDesc'
                />
                <Amount
                    translateIdTitle={prefixTXEntryTitledId('estimatedTotal')}
                    amount='9900000000000000000000'
                    translateIdInfoTooltip='profile.security.mostSecureDesc'
                />
            </Accordion>
            <AccordionTrigger
                id='transaction-details-breakdown'
                translateIdTitle='sendV2.accordionTriggerTitle.transactionDetails'
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default TransactionDetails;