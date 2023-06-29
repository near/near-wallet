import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectAccountUrlReferrer,
    selectAccountLocalStorageAccountId,
} from '../../redux/slices/account';
import VerifyOwnerSummary from './VerifyOwnerSummary';

export default ({
    message,
    onClickCancel,
    onClickApprove,
    signing,
    isValidCallbackUrl
}) => {
    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);

    return (
        <VerifyOwnerSummary
            accountId={accountLocalStorageAccountId}
            onClickCancel={onClickCancel}
            onClickApprove={onClickApprove}
            accountUrlReferrer={accountUrlReferrer}
            message={message}
            signing={signing}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
};
