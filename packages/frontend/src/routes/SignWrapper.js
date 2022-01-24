import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AccountSelector from '../components/accounts/account_selector/AccountSelector';
import Container from '../components/common/styled/Container.css';
import SignTransferRetry from '../components/sign/SignTransferRetry';
import SignTransactionDetailsWrapper from '../components/sign/v2/SignTransactionDetailsWrapper';
import SignTransactionSummaryWrapper from '../components/sign/v2/SignTransactionSummaryWrapper';
import { Mixpanel } from '../mixpanel';
import { getAccountBalance, redirectTo, switchAccount } from '../redux/actions/account';
import { selectAccountAccountsBalances, selectAccountLocalStorageAccountId } from '../redux/slices/account';
import { selectAvailableAccounts } from '../redux/slices/availableAccounts';
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

    const DISPLAY = {
        TRANSACTION_SUMMARY: 0,
        TRANSACTION_DETAILS: 1,
        INSUFFICIENT_NETWORK_FEE: 2,
        ACCOUNT_SELECTION: 3
    };

    const [currentDisplay, setCurrentDisplay] = useState(DISPLAY.TRANSACTION_SUMMARY);

    const signFeesGasLimitIncludingGasChanges = useSelector(selectSignFeesGasLimitIncludingGasChanges);
    const signStatus = useSelector(selectSignStatus);
    const signCallbackUrl = useSelector(selectSignCallbackUrl);
    const signMeta = useSelector(selectSignMeta);
    const transactionHashes = useSelector(selectSignTransactionHashes);
    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const accountAccountsBalances = useSelector(selectAccountAccountsBalances);

    const signGasFee = new BN(signFeesGasLimitIncludingGasChanges).div(new BN('1000000000000')).toString();
    const submittingTransaction = signStatus === SIGN_STATUS.IN_PROGRESS;

    useEffect(() => {
        if (signStatus === SIGN_STATUS.RETRY_TRANSACTION) {
            setCurrentDisplay(DISPLAY.INSUFFICIENT_NETWORK_FEE);
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

    if(currentDisplay === DISPLAY.ACCOUNT_SELECTION) {
        return (
            <Container className='small-centered border'>
                <AccountSelector
                    signedInAccountId={accountLocalStorageAccountId}
                    availableAccounts={availableAccounts}
                    accountsBalances={accountAccountsBalances}
                    onSelectAccount={(accountId) => {
                        dispatch(switchAccount({ accountId }));
                        setCurrentDisplay(DISPLAY.TRANSACTION_SUMMARY);
                    }}
                    getAccountBalance={(accountId) => dispatch(getAccountBalance(accountId))}
                    onSignInToDifferentAccount={() => {
                        Mixpanel.track("LOGIN Click recover different account button");
                        dispatch(redirectTo('/recover-account'));
                    }}
                />
            </Container>
        );
    }

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
        />
    );
}