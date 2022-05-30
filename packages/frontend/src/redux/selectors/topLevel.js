import { createSelector } from 'reselect';

import { selectActiveAccountId } from '../slices/activeAccount';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
export const createParameterSelector = (selector) => (_, params) => selector(params);

const selectAccounts = (state) => state.accounts || {};

const selectShared = (state) => state.shared || {};

const selectAccountState = createSelector(
    [selectAccounts, selectActiveAccountId],
    (accounts, activeAccountId) => accounts[activeAccountId] || {}
);

export const selectSliceByAccountId = (sliceName, initialState) => createSelector(
    selectAccountState, 
    (accountState) => accountState[sliceName] || initialState
);

export const selectSliceFromShared = (sliceName, initialState) => createSelector(
    selectShared, 
    (shared) => shared[sliceName] || initialState
);
