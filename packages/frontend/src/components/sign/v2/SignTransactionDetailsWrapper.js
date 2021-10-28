import React from 'react';
import { useSelector } from 'react-redux';

import { selectSignSlice, selectTransactions } from '../../../redux/slices/sign';
import SignTransactionDetails from './SignTransactionDetails';

export default ({
    onClickGoBack
}) => {
    const signSlice = useSelector(selectSignSlice);
    const transactions = useSelector(selectTransactions);
    return (
        <SignTransactionDetails
            onClickGoBack={onClickGoBack}
            transactions={transactions}
        />
    );
};