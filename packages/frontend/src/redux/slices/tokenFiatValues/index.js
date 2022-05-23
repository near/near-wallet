import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import { createSelector } from 'reselect';

import FiatValueManager from '../../../utils/fiatValueManager';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const SLICE_NAME = 'tokenFiatValues';
const fiatValueManager = new FiatValueManager();

const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    async () => {
        const [coinGeckoTokenFiatValues, refFinanceTokenFiatValues] = await Promise.all(
            [fiatValueManager.getPrice(['near', 'usn']), fiatValueManager.fetchTokenPrices()]
        );
        return merge({}, coinGeckoTokenFiatValues, refFinanceTokenFiatValues);
    }
);

const getTokenWhiteList = createAsyncThunk(
    `${SLICE_NAME}/getTokenWhiteList`,
    async (account_id) => fiatValueManager.fetchTokenWhiteList(account_id)
);


const initialState = {
    ...initialStatusState,
    tokens: {},
};

const tokenFiatValuesSlice = createSlice({
        name: SLICE_NAME,
        initialState,
        extraReducers: ((builder) => {
            builder.addCase(fetchTokenFiatValues.fulfilled, (state, action) => {
                // Payload of .fulfilled is in the same shape as the store; just merge it!
                // { near: { usd: x, lastUpdatedTimestamp: 1212312321, ... }
                const beenUpdatedTokens = {};
                const tokens = cloneDeep(state).tokens;
                Object.keys(action.payload).map((token) => {
                    const previousLastUpdatedAt = tokens[token] ? tokens[token].last_updated_at : 0;
                    const previousPrice = tokens[token] ? tokens[token].usd : 0;
                    const fetchedLastUpdatedAt = action.payload[token].last_updated_at;
                    const fetchedPrice = action.payload[token].usd;
                    if (fetchedLastUpdatedAt > previousLastUpdatedAt && fetchedPrice !== previousPrice) {
                        beenUpdatedTokens[token] = action.payload[token];
                    }
                });
                // Using merge instead of `assign()` so in the future we don't blow away previously loaded token
                // prices when we load new ones with different token names
                if (Object.keys(beenUpdatedTokens).length) {
                    merge(state.tokens, beenUpdatedTokens);
                }
            });
            builder.addCase(getTokenWhiteList.fulfilled, (state, action) => {
                state.tokenWhiteList = action.payload;
            });
            handleAsyncThunkStatus({
                asyncThunk: fetchTokenFiatValues,
                buildStatusPath: () => [],
                builder
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
export const selectFiatValueLoadingState = (state) => state.status.loading;
export const selectFiatValueErrorState = (state) => state.status.error;

export const selectAllTokenFiatValues = (state) => state[SLICE_NAME];
export const selectNearTokenFiatData = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens.near || {});
export const selectNearTokenFiatValueUSD = createSelector(selectNearTokenFiatData, (near) => near.usd);

export const selectUSDNTokenFiatData = createSelector(
    selectAllTokenFiatValues,
    ({ tokens }) => tokens.usn || {}
);
export const selectUSDNTokenFiatValueUSD = createSelector(
    selectUSDNTokenFiatData,
    (usn) => usn.usd
);

export const selectTokensFiatValueUSD = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens || {});
export const selectTokenWhiteList = createSelector(selectAllTokenFiatValues, ({tokenWhiteList}) => tokenWhiteList || []);
