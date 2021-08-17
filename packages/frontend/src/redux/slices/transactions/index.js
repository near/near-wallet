import { createSelector } from 'reselect';

import createParameterSelector from '../../createParameterSelector';

const SLICE_NAME = 'transactions';

const initialState = {
    transactions: {
        byAccountId: {}
    },
    status: {
        
    }
};

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
    },
    extraReducers: ((builder) => {
        
    })
});

export default transactionsSlice;

export const actions = {
    ...transactionsSlice.actions
};

const getAccountIdParam = createParameterSelector((params) => params.accountId);

const getHashParam = createParameterSelector((params) => params.hash);

// Top level selectors
const selectTransactionsSlice = (state) => state[SLICE_NAME] || {};

export const selectTransactionsByAccountId = createSelector(
    [selectTransactionsSlice, getAccountIdParam],
    (transactions, accountId) => transactions[accountId] || []
);

export const selectOneTransactionByHash = createSelector(
    [selectTransactionsByAccountId, getHashParam],
    (transactions, hash) => transactions.find((transaction) => `${transaction.hash}-${transaction.kind}` === hash)
);
