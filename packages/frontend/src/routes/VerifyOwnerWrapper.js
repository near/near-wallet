import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import VerifyOwnerInvalid from '../components/verify-owner/VerifyOwnerInvalid';
import VerifyOwnerSummaryWrapper from '../components/verify-owner/VerifyOwnerSummaryWrapper';
import { redirectTo } from '../redux/actions/account';
import { 
    selectAccountUrlCallbackUrl,
    selectAccountUrlMessage,
    selectAccountUrlMeta 
} from '../redux/slices/account';
import {
    handleAuthorizationRequestConfirmed,
    handleAuthorizationRequestRejected,
    selectVerifyOwnerStatus,
    selectSignedRequest,
    VERIFY_OWNER_STATUS,
    selectVerifyOwnerError,
} from '../redux/slices/verifyOwner';
import { addQueryParams } from '../utils/addQueryParams';
import { isUrlNotJavascriptProtocol } from '../utils/helper-api';

const buildRedirectUrl = (accountUrlCallbackUrl, meta, signedRequest, error) => {
    if (!error) {
        return addQueryParams(accountUrlCallbackUrl, {...signedRequest, meta});
    }
    return addQueryParams(accountUrlCallbackUrl, {
        meta,
        error: error?.message?.substring(0, 100) || 'Unknown error',
    });
};

export function VerifyOwnerWrapper() {
    const dispatch = useDispatch();
    const accountUrlCallbackUrl = useSelector(selectAccountUrlCallbackUrl);
    const accountUrlMeta = useSelector(selectAccountUrlMeta);
    const accountUrlMessage = useSelector(selectAccountUrlMessage);
    const verifyOwnerStatus = useSelector(selectVerifyOwnerStatus);
    const verifyOwnerError = useSelector(selectVerifyOwnerError);
    const signedRequest = useSelector(selectSignedRequest);
    const isValidCallbackUrl = isUrlNotJavascriptProtocol(accountUrlCallbackUrl);
    const isSigning = verifyOwnerStatus === VERIFY_OWNER_STATUS.IN_PROGRESS;

    useEffect(() => {
        if (verifyOwnerStatus === VERIFY_OWNER_STATUS.COMPLETED) {
            if (accountUrlCallbackUrl && isValidCallbackUrl) {
                window.location.href = buildRedirectUrl(accountUrlCallbackUrl, accountUrlMeta, signedRequest, verifyOwnerError);
            } else {
                dispatch(redirectTo('/'));
            }
        }
    }, [verifyOwnerStatus]);

    const handleApproveRequest = async () =>
        dispatch(handleAuthorizationRequestConfirmed(accountUrlMessage));

    const handleRejectRequest = async () => {
        dispatch(handleAuthorizationRequestRejected());
    };

    // potentially malicious callback URL found
    if (!isValidCallbackUrl) {
        return <VerifyOwnerInvalid />;
    }

    return (
        <VerifyOwnerSummaryWrapper
            onClickCancel={handleRejectRequest}
            onClickApprove={handleApproveRequest}
            signing={isSigning}
            message={accountUrlMessage}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
}
