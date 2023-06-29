import React from 'react';
import { useSelector } from 'react-redux';

import {
    selectAccountUrlReferrer,
    selectAccountLocalStorageAccountId,
    selectAvailableBalance
} from '../../../redux/slices/account';
import {
    selectSignTransactionAmount
} from '../../../redux/slices/sign';
import SignTransactionSummary from './SignTransactionSummary';

export default ({
    onClickMoreInformation,
    onClickCancel,
    onClickApprove,
    submittingTransaction,
    signGasFee,
    isSignerValid,
    isValidCallbackUrl
}) => {
    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const availableBalance = useSelector(selectAvailableBalance);
    const signTransactionAmount = useSelector(selectSignTransactionAmount);
    
    return (
        <SignTransactionSummary
            transferAmount={signTransactionAmount}
            accountLocalStorageAccountId={accountLocalStorageAccountId}
            availableBalance={availableBalance}
            estimatedFees={signGasFee}
            onClickCancel={onClickCancel}
            onClickApprove={onClickApprove}
            onClickMoreInformation={onClickMoreInformation}
            accountUrlReferrer={accountUrlReferrer}
            submittingTransaction={submittingTransaction}
            isSignerValid={isSignerValid}
            isValidCallbackUrl={isValidCallbackUrl}
        />
    );
};
