import { createSelector } from 'reselect';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
export const createParameterSelector = (selector) => (_, params) => selector(params);

const selectAccounts = (state) => state.accounts || {};

const getAccountIdParam = createParameterSelector((params) => params.accountId);

export const selectAccountState = createSelector(
    [selectAccounts, getAccountIdParam],
    (accounts, accountId) => accounts[accountId] || {}
);

export const selectSliceByAccountId = (sliceName, initialState) => createSelector(
    selectAccountState, 
    (accountState) => accountState[sliceName] || initialState
);
