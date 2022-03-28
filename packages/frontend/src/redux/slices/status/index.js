import { createSelector } from 'reselect';

import createParameterSelector from '../../selectors/mainSelectors/createParameterSelector';

const SLICE_NAME = 'status';

const getTypes = createParameterSelector((params) => params.types);

// Top level selectors
export const selectStatusSlice = (state) => state[SLICE_NAME];

export const selectStatusMainLoader = createSelector(selectStatusSlice, (status) => status.mainLoader || false);

export const selectStatusLocalAlert = createSelector(selectStatusSlice, (status) => status.localAlert || {});

export const selectStatusActionStatus = createSelector(selectStatusSlice, (status) => status.actionStatus || {});

export const selectActionsPending = createSelector(
    [getTypes, selectStatusActionStatus],
    (types, actionStatus) => types.some((type) => actionStatus[type]?.pending)
);
