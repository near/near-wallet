import React from 'react';
import { useSelector } from 'react-redux';

import { selectSignTransactions } from '../../../redux/slices/sign';
import SignTransactionDetails from './SignTransactionDetails';

export default ({
    onClickGoBack,
    signGasFee
}) => {
    const transactions = useSelector(selectSignTransactions);
    return (
        <SignTransactionDetails
            onClickGoBack={onClickGoBack}
            transactions={transactions}
            signGasFee={signGasFee}
        />
    );
};