import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectAccountUrlReferrer
} from '../../../redux/slices/account';
import SignTransactionSummary from './SignTransactionSummary';

export default ({
    onClickMoreInformation
}) => {
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    return (
        <SignTransactionSummary
            transferAmount='123420000000000234234243000'
            sender='john.doe'
            estimatedFees='123420000000000000'
            onClickCancel={() => {}}
            onClickApprove={() => {}}
            onClickMoreInformation={onClickMoreInformation}
            accountUrlReferrer={accountUrlReferrer}
        />
    );
};