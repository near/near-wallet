import { createSelector } from "reselect";

const SLICE_NAME = 'router';

// Top level selectors
export const selectRouterSlice = (state) => state[SLICE_NAME];
