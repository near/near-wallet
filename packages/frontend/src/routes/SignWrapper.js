import React, { useState } from 'react';

import SignTransactionDetailsWrapper from '../components/sign/v2/SignTransactionDetailsWrapper';
import SignTransactionSummaryWrapper from '../components/sign/v2/SignTransactionSummaryWrapper';

export function SignWrapper() {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    if (showTransactionDetails) {
        return (
            <SignTransactionDetailsWrapper
                onClickGoBack={() => setShowTransactionDetails(false)}
            />
        );
    }

    return (
        <SignTransactionSummaryWrapper
            onClickMoreInformation={() => setShowTransactionDetails(true)}
        />
    );
}