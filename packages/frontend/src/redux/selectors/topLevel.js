import { createSelector } from 'reselect';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
export const createParameterSelector = (selector) => (_, params) => selector(params);

const selectAccountsReducer = (state) => state.accountsReducer || {};

const getAccountIdParam = createParameterSelector((params) => params.accountId);

export const selectAccountState = createSelector(
    [selectAccountsReducer, getAccountIdParam],
    (accountsReducer, accountId) => accountsReducer[accountId] || {}
);

export const selectSliceByAccountId = (sliceName, initialState) => createSelector(
    selectAccountState, 
    (accountState) => accountState[sliceName] || initialState
);
