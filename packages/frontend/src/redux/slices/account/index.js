import { createSelector } from "reselect";

const SLICE_NAME = 'account';

// Top level selectors
export const selectAccountSlice = (state) => state[SLICE_NAME];

export const selectAccountId = createSelector(selectAccountSlice, (account) => account.accountId);

export const selectBalance = createSelector(selectAccountSlice, (account) => account.balance);

