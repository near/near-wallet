import React from 'react';
import { useSelector } from 'react-redux';

import SignTransactionDetails from './SignTransactionDetails';
import { selectSignTransactions } from '../../../redux/slices/sign';

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
