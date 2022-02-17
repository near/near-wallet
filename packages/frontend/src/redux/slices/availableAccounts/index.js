import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import refreshAccountOwner from '../../sharedThunks/refreshAccountOwner';

const SLICE_NAME = 'availableAccounts';

const initialState = {
    ...initialStatusState,
    items: []
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
            buildStatusPath: () => [],
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
