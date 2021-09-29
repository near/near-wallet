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
    }
);

export default availableAccounts;

