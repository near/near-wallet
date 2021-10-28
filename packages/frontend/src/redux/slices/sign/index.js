import { createSelector } from "reselect";
const SLICE_NAME = 'sign';

// Top level selectors
export const selectSignSlice = (state) => state[SLICE_NAME];

export const selectTransactions = createSelector(selectSignSlice, (sign) => sign.transactions || []);
