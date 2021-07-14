import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from './AccordionTrigger';
import Breakdown from './css/Breakdown.css';
import Amount from './entry_types/Amount';

const prefixTXEntryTitledId = (key) => `sendV2.TXEntry.title.${key}`;

const BalanceDetails = () => {
    const [open, setOpen] = useState(false);
    
    return (
        <Breakdown className={classNames(['available-to-send-breakdown' , open ? 'open' : ''])}>
            <Amount
                translateIdTitle={prefixTXEntryTitledId('availableToSend')}
                amount='200000000000000000000'
            />
            <Accordion
                trigger='available-to-send-breakdown'
                className='breakdown'
            >
                <Amount
                    translateIdTitle={prefixTXEntryTitledId('availableBalance')}
                    amount='500000000000000000000'
                />
                <Amount
                    translateIdTitle={prefixTXEntryTitledId('reservedForFees')}
                    amount='9900000000000000000000'
                    translateIdInfoTooltip='profile.security.mostSecureDesc'
                />
            </Accordion>
            <AccordionTrigger
                id='available-to-send-breakdown'
                translateIdTitle='sendV2.accordionTriggerTitle.balanceDetails'
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default BalanceDetails;