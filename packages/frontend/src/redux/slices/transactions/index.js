import {
    createEntityAdapter,
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { 
    getTransactions,
    transactionExtraInfo
} from '../../../utils/explorer-api';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const SLICE_NAME = 'transactions';

const transactionsAdapter = createEntityAdapter({
    selectId: ({ hash_with_index }) => hash_with_index,
    sortComparer: (a, b) => b.block_timestamp - a.block_timestamp,
});

const initialState = {
    byAccountId: {}
};

const initialAccountIdState = {
    ...initialStatusState,
    ...transactionsAdapter.getInitialState()
};

const fetchTransactions = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactions`,
    async ({ accountId }, { dispatch, getState }) => {
        const transactions = await getTransactions({ accountId });

        const { actions: { setTransactions, updateTransactions } } = transactionsSlice;

        selectTransactionsByAccountIdTotal(getState(), { accountId })
            ? dispatch(updateTransactions({ transactions, accountId }))
            : dispatch(setTransactions({ transactions, accountId }));
    }
);

const fetchTransactionStatus = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactionStatus`,
    async ({ hash, signer_id, accountId, hash_with_index }, { dispatch, getState }) => {
        let status;
        try {
            const transactionDetails = await transactionExtraInfo({ hash, signer_id });
            status = Object.keys(transactionDetails.status)[0];
        } catch (error) {
            status = 'notAvailable';
        }
        const checkStatus = ['SuccessValue', 'Failure'].includes(status);
        const { actions: { updateTransactionStatus } } = transactionsSlice;
        dispatch(updateTransactionStatus({ status, checkStatus, accountId, hash, hash_with_index }));
    }
);

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTransactions(state, { payload: { accountId, transactions }}) {
            transactionsAdapter.setAll(state.byAccountId[accountId], transactions);
        },
        updateTransactions(state, { payload: { accountId, transactions }}) {
            transactionsAdapter.upsertMany(state.byAccountId[accountId], transactions);
        },
        updateTransactionStatus(state, { payload: { status, checkStatus, accountId, hash_with_index }}) {
            transactionsAdapter.updateOne(state.byAccountId[accountId], { id: hash_with_index, changes: { status, checkStatus } });
        },
    },
    extraReducers: ((builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchTransactions,
            buildStatusPath: ({ meta: { arg: { accountId }}}) => ['byAccountId', accountId],
            builder
        });
    })
});

export default transactionsSlice;

export const actions = {
    fetchTransactions,
    fetchTransactionStatus,
    ...transactionsSlice.actions
};


// entity adapter selectors
export const {
    selectAll: selectTransactionsByAccountId,
    selectTotal: selectTransactionsByAccountIdTotal
} = transactionsAdapter.getSelectors((state, { accountId }) => ({
    ...initialAccountIdState,
    ...state.transactions.byAccountId[accountId]
}));

export const selectTransactionsOneByIdentity = (state, { accountId, id }) => transactionsAdapter.getSelectors().selectById({
    ...initialAccountIdState,
    ...state.transactions.byAccountId[accountId]
}, id);

// status selectors
export const selectTransactionsObject = (state, { accountId }) => state[SLICE_NAME].byAccountId[accountId] || {};

export const selectTransactionsStatus = createSelector([selectTransactionsObject], (transactions) => transactions.status || initialStatusState);

export const selectTransactionsLoading = createSelector(selectTransactionsStatus, (status) => status.loading || initialStatusState.loading);
