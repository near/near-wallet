import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import { createSelector } from 'reselect';

import sendJson from '../../../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from '../../../utils/wallet';

const SLICE_NAME = 'tokenFiatValues';

const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    () => sendJson('GET', ACCOUNT_HELPER_URL + `/fiat`)
);


const initialState = {
    loading: false,
    error: null,
    tokens: {}
};

const tokenFiatValuesSlice = createSlice({
        name: SLICE_NAME,
        initialState,
        extraReducers: ((builder) => {
            builder.addCase(fetchTokenFiatValues.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchTokenFiatValues.fulfilled, (state, action) => {
                // Payload of .fulfilled is in the same shape as the store; just merge it!
                // { near: { usd: x, lastUpdatedTimestamp: 1212312321, ... }

                state.loading = false;
                state.error = null;

                // Using merge instead of `assign()` so in the future we don't blow away previously loaded token
                // prices when we load new ones with different token names
                merge(state.tokens, action.payload);
            });

            builder.addCase(fetchTokenFiatValues.rejected, (state, action) => {
                state.loading = false;

                // TODO: Localize this?
                state.error = action.error?.message || 'An error was encountered.';
            });
        })
    }
);

export default tokenFiatValuesSlice;

export const reducer = tokenFiatValuesSlice.reducer;
export const actions = {
    fetchTokenFiatValues
};

// Future: Refactor to track loading state and error states _per token type_, when we actually support multiple tokens
export const selectFiatValueLoadingState = (state) => state.loading;
export const selectFiatValueErrorState = (state) => state.error;

export const selectAllTokenFiatValues = (state) => state[SLICE_NAME];
export const selectNearTokenFiatData = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens.near || {});
export const selectNearTokenFiatValueUSD = createSelector(selectNearTokenFiatData, (near) => near.usd);