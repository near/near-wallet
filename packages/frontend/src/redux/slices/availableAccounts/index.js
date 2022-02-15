import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import refreshAccountOwner from '../../sharedThunks/refreshAccountOwner';
import handleAsyncThunkStatus from '../handleAsyncThunkStatus';
import initialErrorState from '../initialErrorState';

const SLICE_NAME = 'availableAccounts';

const initialState = {
    items: [],
    status: {
        loading: false,
        error: initialErrorState
    }
};

const availableAccountsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    extraReducers: ((builder) => {
        builder.addCase(refreshAccountOwner.fulfilled, (state, action) => {
            set(state, ['items'], Object.keys((action.payload && action.payload.accounts) || {}).sort());
        });
        handleAsyncThunkStatus({
            asyncThunk: refreshAccountOwner,
            buildStatusPath: () => ['status'],
            builder
        });
    })
});

export default availableAccountsSlice;

export const actions = availableAccountsSlice.actions;

// Top level selectors
const selectAvailableAccountsSlice = (state) => state[availableAccountsSlice.name];

export const selectAvailableAccounts = createSelector(
    selectAvailableAccountsSlice,
    (availableAccounts) => availableAccounts.items || []
);

export const selectAvailableAccountsIsLoading = createSelector(
    selectAvailableAccountsSlice,
    (availableAccounts) => availableAccounts.status && availableAccounts.status.loading
);
