import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectSignSlice, selectTransactions } from '../../../redux/slices/sign';
import TransactionDetails from './TransactionDetails';
import TransactionSummary from './TransactionSummary';

export function SignWrapper() {
    const [showTransactionDetails, setShowTransactionDetails] = useState(true);
    const signSlice = useSelector(selectSignSlice);
    const transactions = useSelector(selectTransactions);

    if (showTransactionDetails) {
        return (
            <TransactionDetails
                onClickGoBack={() => setShowTransactionDetails(false)}
                transactions={transactions}
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