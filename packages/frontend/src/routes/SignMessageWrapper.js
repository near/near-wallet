import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SignTransferInvalid from '../components/sign/SignTransferInvalid';
import SignMessageDetails from '../components/sign/sm/SignMessageDetails';
import SignMessageSummaryWrapper from '../components/sign/sm/SignMessageSummaryWrapper';
import { Mixpanel } from '../mixpanel';
import { redirectTo } from '../redux/actions/account';
import { selectAccountId } from '../redux/slices/account';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../redux/slices/availableAccounts';
import {
    addQueryParams,
    SIGN_STATUS,
    selectSignStatus,
    selectSignCallbackUrl,
    selectSignMeta,
    handleSignMessage,
    selectMessage,
    selectSigned as selectSignMessageResult
} from '../redux/slices/sign';
import { isUrlNotJavascriptProtocol } from '../utils/helper-api';

export function SignMessageWrapper() {
    const dispatch = useDispatch();

    const DISPLAY = {
        SIGNATURE_SUMMARY: 0,
        SIGNATURE_DETAILS: 1,
    };

    const [currentDisplay, setCurrentDisplay] = useState(DISPLAY.SIGNATURE_SUMMARY);

    const signStatus = useSelector(selectSignStatus);
    const signCallbackUrl = useSelector(selectSignCallbackUrl);
    const signMeta = useSelector(selectSignMeta);
    const signedMessage = useSelector(selectMessage);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const accountId = useSelector(selectAccountId);
    const signMessageResult = useSelector(selectSignMessageResult);
    const isValidCallbackUrl = isUrlNotJavascriptProtocol(signCallbackUrl);

    const signingMessage = signStatus === SIGN_STATUS.IN_PROGRESS;

    useEffect(() => {
        setCurrentDisplay(DISPLAY.SIGNATURE_SUMMARY);
    },[availableAccounts, accountId, availableAccountsIsLoading]);

    useEffect(() => {
        if (signStatus === SIGN_STATUS.SUCCESS) {
            
            const publicKey = Buffer.from(signMessageResult.signed.publicKey.data).toString('base64');
            const signedMessage = Buffer.from(signMessageResult.signed.signature).toString('base64');
            if (signCallbackUrl && isValidCallbackUrl) {
                window.location.href = addQueryParams(signCallbackUrl, {
                    signMeta,
                    accountId,
                    signedMessage,
                    publicKey
                });
            } else {
                dispatch(redirectTo('/'));
            }
        }
    }, [signStatus]);

    const handleApproveSignature = async () => {
        Mixpanel.track('SIGN approve the transaction');
        await dispatch(handleSignMessage());
    };

    const handleCancelSignature = async () => {
        Mixpanel.track('SIGN Deny the transaction');
        if (signCallbackUrl && isValidCallbackUrl) {
            if (signStatus?.success !== false) {
                window.location.href = addQueryParams(signCallbackUrl, {
                    signMeta,
                    errorCode: encodeURIComponent('userRejected'),
                    errorMessage: encodeURIComponent('User rejected transaction')
                });
                return;
            }
            window.location.href = addQueryParams(signCallbackUrl, {
                signMeta,
                errorCode: encodeURIComponent(signStatus?.errorType) || encodeURIComponent('unknownError'),
                errorMessage: encodeURIComponent(signStatus?.errorMessage?.substring(0, 100)) || encodeURIComponent('Unknown error')
            });
            return;
        } else {
            dispatch(redirectTo('/'));
        }
    };

    // potentially malicious callback URL found
    if (!isValidCallbackUrl) {
        return (
            <SignTransferInvalid />
        );
    }

    if (currentDisplay === DISPLAY.SIGNATURE_DETAILS) {
        return (
            <SignMessageDetails
                message={signedMessage}
                onClickGoBack={() => setCurrentDisplay(DISPLAY.SIGNATURE_SUMMARY)}
            />
        );
    }

    return (
        <SignMessageSummaryWrapper
            onClickCancel={handleCancelSignature}
            onClickApprove={handleApproveSignature}
            signingMessage={signingMessage}
            onClickMoreInformation={() => setCurrentDisplay(DISPLAY.SIGNATURE_DETAILS)}
            onClickEditAccount={() => setCurrentDisplay(DISPLAY.ACCOUNT_SELECTION)}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
}
