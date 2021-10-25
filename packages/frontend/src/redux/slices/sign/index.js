const SLICE_NAME = 'sign';

// Top level selectors
export const selectSignSlice = (state) => state[SLICE_NAME];

export const selectSignTransactions = createSelector(
    [selectSignSlice],
    (sign) => sign.transactions || []
);

export const selectSignCallbackUrl = createSelector(
    [selectSignSlice],
    (sign) => sign.callbackUrl
);

export const selectSignMeta = createSelector(
    [selectSignSlice],
    (sign) => sign.meta
);
