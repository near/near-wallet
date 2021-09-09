import { getLocation } from 'connected-react-router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { MIN_BALANCE_TO_CREATE } from '../../../../utils/wallet';
import FundingReceived from './FundingReceived';
import FundWithCreditCard from './FundWithCreditCard';
import FundWithManualDeposit from './FundWithManualDeposit';

export function InitialDepositWrapper() {
    const [fundingNeeded, setFundingNeeded] = useState(true);

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const fundingMethod = URLParams.get('fundingMethod');

    if (!fundingNeeded) {
        return (
            <FundingReceived />
        );
    }

    if (fundingMethod === 'creditCard') {
        return (
            <FundWithCreditCard
                minDeposit={MIN_BALANCE_TO_CREATE}
            />
        );
    }

    return (
        <FundWithManualDeposit
            minDeposit={MIN_BALANCE_TO_CREATE}
        />
    );
}