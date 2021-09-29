import { createReducer } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import refreshAccountOwner from '../../sharedThunks/refreshAccountOwner';
import initialErrorState from '../initialErrorState';

const initialState = {
    items: [],
    status: {
        loading: false,
        error: initialErrorState
    }
};

const availableAccounts = createReducer(
    initialState,
    (builder) => {
        builder.addCase(refreshAccountOwner.pending, (state) => {
            set(state, ['status', 'loading'], true);
            set(state, ['status', 'error'], initialErrorState);
        });
        builder.addCase(refreshAccountOwner.fulfilled, (state, action) => {
            set(state, ['status', 'loading'], false);
            set(state, ['status', 'error'], initialErrorState);

            set(state, ['items'], Object.keys((action.payload && action.payload.accounts) || {}).sort());
        });
        builder.addCase(refreshAccountOwner.rejected, (state, { error }) => {
            set(state, ['status', 'loading'], false);
            set(state, ['status', 'error'], {
                message: error?.message || 'An error was encountered.',
                code: error?.code
            });
        });
    }
);

export default availableAccounts;

// Top level selectors
const selectAvailableAccountsSlice = (state) => state['availableAccounts'];

export const selectAvailableAccounts = createSelector(
    selectAvailableAccountsSlice,
    (availableAccounts) => availableAccounts.items || []
);
