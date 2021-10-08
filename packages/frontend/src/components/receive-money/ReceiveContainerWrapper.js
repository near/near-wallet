import React from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId, selectBalance } from '../../redux/slices/account';
import ReceiveContainer from './ReceiveContainer';

export function ReceiveContainerWrapper() {
    const accountId = useSelector((state) => selectAccountId(state));
    const balance = useSelector((state) => selectBalance(state));

    const availableBalance = balance?.balanceAvailable;

    //TODO: Add support for receiver in URL

    return (
        <ReceiveContainer
            accountId={accountId}
            availableBalance={availableBalance}
        />
    );
};
