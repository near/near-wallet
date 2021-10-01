import { createSelector } from "reselect";

const SLICE_NAME = 'router';

// Top level selectors
export const selectRouterSlice = (state) => state[SLICE_NAME];

export const selectRouterLocation = createSelector(selectRouterSlice, (router) => router.location || {});

export const selectRouterLocationSearch = createSelector(selectRouterLocation, (location) => location.search);
