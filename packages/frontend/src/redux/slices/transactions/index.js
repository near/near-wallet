import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

const fetchTransactions = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactions`,
    async ({ accountId }, { dispatch, getState }) => {
    }
);

const fetchTransactionStatus = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactionStatus`,
    async ({ hash, signer_id, accountId }, { dispatch, getState }) => {
    }
);

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        addTransactions(state, { payload }) {
            const { transactions, accountId } = payload;
            set(state, ['transactions', 'byAccountId', accountId], transactions);
        },
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
