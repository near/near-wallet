import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import { createSelector } from 'reselect';

import { ACCOUNT_HELPER_URL } from '../../../config';
import sendJson from '../../../tmp_fetch_send_json';
import { fetchTokenPrices, fetchTokenWhiteList } from '../../../utils/ref-finance';
import initialErrorState from '../initialErrorState';

const SLICE_NAME = 'tokenFiatValues';

const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    async () => {
        const nearFiatValue = await sendJson('GET', ACCOUNT_HELPER_URL + `/fiat`);
        // TODO: Rewrite this function call on by demand or even create separate action.

        const tokenPrices = await fetchTokenPrices();
        const last_updated_at = Date.now() / 1000; 

        const tokenFiatValues = Object.keys(tokenPrices).reduce((acc, curr) => {
            return ({
                ...acc,
                [curr]: {
                    usd: +Number(tokenPrices[curr]?.price).toFixed(2) || null,
                    last_updated_at
                }
            });
        }, {});
    
        return merge(nearFiatValue, tokenFiatValues);
    }
);

const getTokenWhiteList = createAsyncThunk(
    `${SLICE_NAME}/getTokenWhiteList`,
    async (account_id) => fetchTokenWhiteList(account_id)
);

const initialState = {
    loading: false,
    error: initialErrorState,
    tokens: {},
    tokenWhiteList: [],
};

const tokenFiatValuesSlice = createSlice({
        name: SLICE_NAME,
        initialState,
        extraReducers: ((builder) => {
            builder.addCase(fetchTokenFiatValues.pending, (state, action) => {
                state.loading = true;
                state.error = initialErrorState;
            });

            builder.addCase(fetchTokenFiatValues.fulfilled, (state, action) => {
                // Payload of .fulfilled is in the same shape as the store; just merge it!
                // { near: { usd: x, lastUpdatedTimestamp: 1212312321, ... }

                state.loading = false;
                state.error = initialErrorState;

                // Using merge instead of `assign()` so in the future we don't blow away previously loaded token
                // prices when we load new ones with different token names
                merge(state.tokens, action.payload);
            });

            builder.addCase(fetchTokenFiatValues.rejected, (state, { error }) => {
                state.loading = false;

                // TODO: Localize this?
                state.error = {
                    message: error?.message || 'An error was encountered.',
                    code: error?.code
                };
            });

            builder.addCase(getTokenWhiteList.fulfilled, (state, action) => {
                state.tokenWhiteList = action.payload;
            });
        })
    }
);

export default tokenFiatValuesSlice;

export const reducer = tokenFiatValuesSlice.reducer;
export const actions = {
    fetchTokenFiatValues,
    getTokenWhiteList
};

// Future: Refactor to track loading state and error states _per token type_, when we actually support multiple tokens
export const selectFiatValueLoadingState = (state) => state.loading;
export const selectFiatValueErrorState = (state) => state.error;

export const selectAllTokenFiatValues = (state) => state[SLICE_NAME];
export const selectNearTokenFiatData = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens.near || {});
export const selectNearTokenFiatValueUSD = createSelector(selectNearTokenFiatData, (near) => near.usd);

export const selectTokensFiatValueUSD = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens || {});
export const selectTokenWhiteList = createSelector(selectAllTokenFiatValues, ({tokenWhiteList}) => tokenWhiteList || []);