import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectAccountUrlReferrer,
    selectAccountLocalStorageAccountId,
} from '../../../redux/slices/account';
import {
    selectSignTransactionAmount
} from '../../../redux/slices/sign';
import SignMessageSummary from './SignMessageSummary';

export default ({
    onClickMoreInformation,
    onClickCancel,
    onClickApprove,
    signingMessage,
    isValidCallbackUrl
}) => {
    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const signTransactionAmount = useSelector(selectSignTransactionAmount);
    
    return (
        <SignMessageSummary
            transferAmount={signTransactionAmount}
            accountLocalStorageAccountId={accountLocalStorageAccountId}
            onClickCancel={onClickCancel}
            onClickApprove={onClickApprove}
            onClickMoreInformation={onClickMoreInformation}
            accountUrlReferrer={accountUrlReferrer}
            signingMessage={signingMessage}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
};
