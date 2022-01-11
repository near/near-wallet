import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SignTransferRetry from '../components/sign/SignTransferRetry';
import SignTransactionDetailsWrapper from '../components/sign/v2/SignTransactionDetailsWrapper';
import SignTransactionSummaryWrapper from '../components/sign/v2/SignTransactionSummaryWrapper';
import { Mixpanel } from '../mixpanel';
import {
    addQueryParams,
    handleSignTransactions,
    selectSignFeesGasLimitIncludingGasChanges,
    SIGN_STATUS,
    selectSignStatus,
    selectSignCallbackUrl,
    selectSignMeta,
    selectSignTransactionHashes
} from '../redux/slices/sign';

export function SignWrapper() {
    const dispatch = useDispatch();

    const [showTransactionDetails, setShowTransactionDetails] = useState(false);
    const [insufficientNetworkFee, setInsufficientNetworkFee] = useState(false);

    const signFeesGasLimitIncludingGasChanges = useSelector(selectSignFeesGasLimitIncludingGasChanges);
    const signStatus = useSelector(selectSignStatus);
    const signCallbackUrl = useSelector(selectSignCallbackUrl);
    const signMeta = useSelector(selectSignMeta);
    const transactionHashes = useSelector(selectSignTransactionHashes);

    const signGasFee = new BN(signFeesGasLimitIncludingGasChanges).div(new BN('1000000000000')).toString();
    const submittingTransaction = signStatus === SIGN_STATUS.IN_PROGRESS;

    useEffect(() => {
        if (signStatus === SIGN_STATUS.RETRY_TRANSACTION) {
            setInsufficientNetworkFee(true);
        }
        
        if (signStatus === SIGN_STATUS.SUCCESS) {
            if (signCallbackUrl && !!transactionHashes.length) {
                window.location.href = addQueryParams(signCallbackUrl, {
                    signMeta,
                    transactionHashes: transactionHashes.join(',')
                });
            }
        }
    }, [signStatus]);

    const handleApproveTransaction = async () => {
        Mixpanel.track("SIGN approve the transaction");
        await dispatch(handleSignTransactions());
    };

    const handleCancelTransaction = async () => {
        Mixpanel.track("SIGN Deny the transaction");
        if (signCallbackUrl) {
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
        }
    };

    if (insufficientNetworkFee) {
        return (
            <SignTransferRetry
                handleRetry={handleApproveTransaction}
                handleCancel={handleCancelTransaction}
                gasLimit={signGasFee}
                submittingTransaction={submittingTransaction}
            />
        );
    }

    if (showTransactionDetails) {
        return (
            <SignTransactionDetailsWrapper
                onClickGoBack={() => setShowTransactionDetails(false)}
                signGasFee={signGasFee}
            />
        );
    }

    return (
        <SignTransactionSummaryWrapper
            onClickCancel={handleCancelTransaction}
            onClickApprove={handleApproveTransaction}
            submittingTransaction={submittingTransaction}
            signGasFee={signGasFee}
            onClickMoreInformation={() => setShowTransactionDetails(true)}
        />
    );
}