import { createSelector } from "reselect";

import createParameterSelector from '../createParameterSelector';

const SLICE_NAME = 'status';

const getTypes = createParameterSelector((params) => params.types);

const getTypePrefix = createParameterSelector((params) => params.typePrefix);

// Top level selectors
export const selectStatusSlice = (state) => state[SLICE_NAME];

export const selectStatusMainLoader = createSelector(selectStatusSlice, (status) => status.mainLoader || false);

export const selectStatusLocalAlert = createSelector(selectStatusSlice, (status) => status.localAlert || {});

export const selectStatusActionStatus = createSelector(selectStatusSlice, (status) => status.actionStatus || []);

export const selectActionsPending = createSelector(
    [getTypes, selectStatusActionStatus],
    (types, actionStatus) => (typeof types === 'string' ? [types] : types).some((type) => actionStatus[type]?.pending)
);

export const selectActionsPendingByPrefix = createSelector(
    [getTypePrefix, selectStatusActionStatus],
    (typePrefix, actionStatus) => Object.keys(actionStatus).some((type) => {
        if (type.startsWith(typePrefix)) {
            return actionStatus[type]?.pending;
        }
        return false;
    })
);
