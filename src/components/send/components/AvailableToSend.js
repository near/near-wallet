import React, { useState } from 'react';

import classNames from '../../../utils/classNames';
import Accordion from '../../common/Accordion';
import AccordionTrigger from './AccordionTrigger';
import Breakdown from './Breakdown.css';
import Amount from './entry_types/Amount';

const translate = (type) => `sendV2.availableToSend.${type}`;

const AvailableToSend = () => {
    const [open, setOpen] = useState(false);
    
    return (
        <Breakdown className={classNames(['available-to-send-breakdown' , open ? 'open' : ''])}>
            <Amount
                translate={translate('availableToSend')}
                amount='200000000000000000000'
            />
            <Accordion
                trigger='available-to-send-breakdown'
                className='breakdown'
            >
                <Amount
                    translate={translate('availableBalance')}
                    amount='500000000000000000000'
                />
                <Amount
                    translate={translate('reservedForFees')}
                    amount='9900000000000000000000'
                    infoTranslate='profile.security.mostSecureDesc'
                />
            </Accordion>
            <AccordionTrigger
                id='available-to-send-breakdown'
                translate={translate('balanceDetails')}
                open={open}
                onClick={() => setOpen(!open)}
            />
        </Breakdown>
    );
};

export default AvailableToSend;