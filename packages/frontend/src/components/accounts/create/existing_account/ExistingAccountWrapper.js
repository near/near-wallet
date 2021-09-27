import BN from 'bn.js';
import { getLocation } from 'connected-react-router';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectAccountId } from '../../../../redux/reducers/account';
import { MIN_BALANCE_TO_CREATE, wallet } from '../../../../utils/wallet';
import FundNewAccount from './FundNewAccount';
import SelectAccount from './SelectAccount';

export function ExistingAccountWrapper({ history }) {
    const dispatch = useDispatch();

    const signedInAccountId = useSelector(selectAccountId);
    const [fundingAccountId, setFundingAccountId] = useState('');

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');
    const fundingMethod = URLParams.get('fundingMethod');

    const formattedMinDeposit = formatNearAmount(MIN_BALANCE_TO_CREATE);

    if (fundingAccountId) {
        return (
            <FundNewAccount
                onClickPrimary={() => console.log('FIX: create account')}
                onClickSecondary={() => setFundingAccountId('')}
                transferAmount={MIN_BALANCE_TO_CREATE}
            />
        );
    }

    return (
        <SelectAccount
            onClickPrimary={() => setFundingAccountId(signedInAccountId)}
            onClickSecondary={() => history.goBack()}
        />
    );
}