import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import { getTransactions, transactionExtraInfo } from '../../../utils/explorer-api';
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
        const transactions = await getTransactions({ accountId });

        const { actions: { setTransactions, updateTransactions } } = transactionsSlice;

        !selectTransactionsByAccountId(getState(), { accountId }).length
            ? dispatch(setTransactions({ transactions, accountId }))
            : dispatch(updateTransactions({ transactions, accountId }));
    }
);

const fetchTransactionStatus = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactionStatus`,
    async ({ hash, signer_id, accountId }, { dispatch, getState }) => {
        let status;
        try {
            const transactionDetails = await transactionExtraInfo({ hash, signer_id });
            status = Object.keys(transactionDetails.status)[0];
        } catch (error) {
            status = 'notAvailable';
        }
        const checkStatus = ['SuccessValue', 'Failure'].includes(status);

        const { actions: { updateTransactionStatus } } = transactionsSlice;
        dispatch(updateTransactionStatus({ status, checkStatus, accountId, hash }));
    }
);

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTransactions(state, { payload }) {
            const { transactions, accountId } = payload;
            set(state, ['transactions', 'byAccountId', accountId], transactions);
        },
        updateTransactions(state, { payload }) {
            const { transactions, accountId } = payload;

            const transactionsState = state.transactions.byAccountId[accountId];
            const hash = transactionsState.map((t) => t.hash_with_index);

            // when updating the transaction, we do not want to replace the entire array, because for some entries the tx status may already be fetched
            transactions.forEach((t) => {
                if (!hash.includes(t.hash_with_index)) {
                    transactionsState.unshift(t);
                    if (transactionsState.length > 10) {
                        transactionsState.pop();
                    }
                }
            });
        },
        updateTransactionStatus(state, { payload }) {
            const { status, checkStatus, accountId, hash } = payload;

            const transactionsState = state.transactions.byAccountId[accountId];

            const transactionEntry = transactionsState.find((t) => t.hash === hash);
            if (transactionEntry) {
                Object.assign(transactionEntry, { status, checkStatus});
            }
        }
    },
    extraReducers: ((builder) => {
        builder.addCase(fetchTransactions.pending, (state) => {
            set(state, ['status', 'loading'], true);
        });
        builder.addCase(fetchTransactions.fulfilled, (state) => {
            set(state, ['status', 'loading'], false);
        });
    })
});

export default transactionsSlice;

export const actions = {
    fetchTransactions,
    fetchTransactionStatus,
    ...transactionsSlice.actions
};

const getAccountIdParam = createParameterSelector((params) => params.accountId);

const getHashParam = createParameterSelector((params) => params.hash);

// Top level selectors
const selectTransactionsSlice = (state) => state[SLICE_NAME] || {};

const selectTransactions = createSelector(
    [selectTransactionsSlice],
    (transactions) => transactions.transactions || {}
);

export const selectTransactionsByAccountId = createSelector(
    [selectTransactions, getAccountIdParam],
    (transactions, accountId) => transactions.byAccountId[accountId] || []
);

export const selectOneTransactionByHash = createSelector(
    [selectTransactionsByAccountId, getHashParam],
    (transactionsByAccountId, hash) => transactionsByAccountId.find((transaction) => `${transaction.hash}-${transaction.kind}` === hash)
);

export const selectTransactionsLoading = createSelector(
    [selectTransactionsSlice],
    (transactions) => transactions.status.loading || false
);
