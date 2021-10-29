import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectAccountUrlReferrer,
    selectAccountLocalStorageAccountId,
    selectAvailableBalance
} from '../../../redux/slices/account';
import SignTransactionSummary from './SignTransactionSummary';

export default ({
    onClickMoreInformation
}) => {

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const availableBalance = useSelector(selectAvailableBalance);
    
    return (
        <SignTransactionSummary
            transferAmount='123420000000000234234243000'
            accountLocalStorageAccountId={accountLocalStorageAccountId}
            availableBalance={availableBalance}
            estimatedFees='123420000000000000'
            onClickCancel={() => {}}
            onClickApprove={() => {}}
            onClickMoreInformation={onClickMoreInformation}
            accountUrlReferrer={accountUrlReferrer}
        />
    );
};