import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SignTransferAccountNotFound from '../components/sign/SignTransferAccountNotFound';
import SignTransferRetry from '../components/sign/SignTransferRetry';
import SignTransactionDetailsWrapper from '../components/sign/v2/SignTransactionDetailsWrapper';
import SignTransactionSummaryWrapper from '../components/sign/v2/SignTransactionSummaryWrapper';
import { Mixpanel } from '../mixpanel';
import { switchAccount, redirectTo } from '../redux/actions/account';
import { selectAccountId } from '../redux/slices/account';
import { selectAvailableAccounts, selectAvailableAccountsIsLoading } from '../redux/slices/availableAccounts';
import {
    addQueryParams,
    handleSignTransactions,
    selectSignFeesGasLimitIncludingGasChanges,
    SIGN_STATUS,
    selectSignStatus,
    selectSignCallbackUrl,
    selectSignMeta,
    selectSignTransactionHashes,
    selectSignTransactions,
    selectSignTransactionsBatchIsValid
} from '../redux/slices/sign';
import { isUrlNotJavascriptProtocol } from '../utils/helper-api';

export function SignWrapper() {
    const dispatch = useDispatch();

    const DISPLAY = {
        TRANSACTION_SUMMARY: 0,
        TRANSACTION_DETAILS: 1,
        INSUFFICIENT_NETWORK_FEE: 2,
        ACCOUNT_NOT_FOUND: 3
    };

    const [currentDisplay, setCurrentDisplay] = useState(DISPLAY.TRANSACTION_SUMMARY);

    const signFeesGasLimitIncludingGasChanges = useSelector(selectSignFeesGasLimitIncludingGasChanges);
    const signStatus = useSelector(selectSignStatus);
    const signCallbackUrl = useSelector(selectSignCallbackUrl);
    const signMeta = useSelector(selectSignMeta);
    const transactionHashes = useSelector(selectSignTransactionHashes);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const availableAccountsIsLoading = useSelector(selectAvailableAccountsIsLoading);
    const transactions = useSelector(selectSignTransactions);
    const accountId = useSelector(selectAccountId);
    const transactionBatchisValid = useSelector(selectSignTransactionsBatchIsValid);
    const isValidCallbackUrl = isUrlNotJavascriptProtocol(signCallbackUrl);

    const signerId = transactions.length && transactions[0].signerId;
    const signGasFee = new BN(signFeesGasLimitIncludingGasChanges).div(new BN('1000000000000')).toString();
    const submittingTransaction = signStatus === SIGN_STATUS.IN_PROGRESS;
    const isSignerValid = accountId === signerId;

    useEffect(() => {
        if (!transactionBatchisValid) {
            // switch to invalid batch screen
        } else if (signerId && !availableAccountsIsLoading && !availableAccounts.some(
            (accountId) => accountId === signerId
        )) {
            setCurrentDisplay(DISPLAY.ACCOUNT_NOT_FOUND);
        } else {
            setCurrentDisplay(DISPLAY.TRANSACTION_SUMMARY);
        }
    },[signerId, transactionBatchisValid, availableAccounts, accountId, availableAccountsIsLoading]);

    useEffect(() => {
            if (
                !isSignerValid &&
                availableAccounts.some(
                    (accountId) => accountId === signerId
                )
            ) {
                dispatch(
                    switchAccount({ accountId: signerId })
                );
            }
    }, [signerId, availableAccounts, accountId]);

    useEffect(() => {
        if (signStatus === SIGN_STATUS.RETRY_TRANSACTION) {
            setCurrentDisplay(DISPLAY.INSUFFICIENT_NETWORK_FEE);
        }
        
        if (signStatus === SIGN_STATUS.SUCCESS) {
            if (signCallbackUrl && !!transactionHashes.length && isValidCallbackUrl) {
                window.location.href = addQueryParams(signCallbackUrl, {
                    signMeta,
                    transactionHashes: transactionHashes.join(',')
                });
            } else {
                dispatch(redirectTo('/'));
            }
        }
    }, [signStatus]);

    const handleApproveTransaction = async () => {
        Mixpanel.track('SIGN approve the transaction');
        await dispatch(handleSignTransactions());
    };

    const handleCancelTransaction = async () => {
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

    if (currentDisplay === DISPLAY.INSUFFICIENT_NETWORK_FEE) {
        return (
            <SignTransferRetry
                handleRetry={handleApproveTransaction}
                handleCancel={handleCancelTransaction}
                gasLimit={signGasFee}
                submittingTransaction={submittingTransaction}
            />
        );
    }

    if (currentDisplay === DISPLAY.ACCOUNT_NOT_FOUND) {
        return (
            <SignTransferAccountNotFound
                handleRetry={handleApproveTransaction}
                handleCancel={handleCancelTransaction}
                signCallbackUrl={signCallbackUrl}
                signTransactionSignerId={signerId}
                submittingTransaction={submittingTransaction}
            />
        );
    }

    if (currentDisplay === DISPLAY.TRANSACTION_DETAILS) {
        return (
            <SignTransactionDetailsWrapper
                onClickGoBack={() => setCurrentDisplay(DISPLAY.TRANSACTION_SUMMARY)}
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
            onClickMoreInformation={() => setCurrentDisplay(DISPLAY.TRANSACTION_DETAILS)}
            onClickEditAccount={() => setCurrentDisplay(DISPLAY.ACCOUNT_SELECTION)}
            isSignerValid={isSignerValid}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
}
