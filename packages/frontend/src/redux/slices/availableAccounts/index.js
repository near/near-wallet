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
    }
);

export default availableAccounts;

