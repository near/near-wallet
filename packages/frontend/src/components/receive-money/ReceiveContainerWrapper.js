import React from 'react';
import { useSelector } from 'react-redux';

import { selectAccountLocalStorageAccountId, selectAccountId, selectBalance } from '../../redux/slices/account';
import ReceiveContainer from './ReceiveContainer';

export function ReceiveContainerWrapper() {
    const accountId = useSelector(selectAccountId);
    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const balance = useSelector(selectBalance);

    const availableBalance = balance?.balanceAvailable || (!accountId && '0');

    //TODO: Add support for receiver in URL

    return (
        <ReceiveContainer
            accountId={accountLocalStorageAccountId}
            availableBalance={availableBalance}
        />
    );
};
