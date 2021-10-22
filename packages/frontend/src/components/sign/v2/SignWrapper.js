import React, { useState } from 'react';

import TransactionDetails from './TransactionDetails';
import TransactionSummary from './TransactionSummary';

export function SignWrapper() {
    const [showTransactionDetails, setShowTransactionDetails] = useState(true);

    if (showTransactionDetails) {
        return (
            <TransactionDetails
                onClickGoBack={() => setShowTransactionDetails(false)}
            />
        );
    }

    return (
        <TransactionSummary
            transferAmount='123420000000000234234243000'
            sender='john.doe'
            estimatedFees='123420000000000000'
            onClickCancel={() => {}}
            onClickApprove={() => {}}
            onClickMoreInformation={() => setShowTransactionDetails(true)}
        />
    );
}