import { createSelector } from 'reselect';

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
export const createParameterSelector = (selector) => (_, params) => selector(params);

export const selectAccountState = (state, { accountId }) => state[accountId] || {};

export const selectSliceByAccountId = (sliceName, initialState) => createSelector(
    selectAccountState, 
    (accountState) => accountState[sliceName] || initialState
);
