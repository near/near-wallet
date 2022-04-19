import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import { createSelector } from 'reselect';

import { ACCOUNT_HELPER_URL } from '../../../config';
import sendJson from '../../../tmp_fetch_send_json';
import { fetchTokenPrices, fetchTokenWhiteList } from '../../../utils/ref-finance';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const SLICE_NAME = 'tokenFiatValues';
const url = 'https://api.coingecko.com/api/v3/simple/price?ids=Tether&vs_currencies=usd';

const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    async () => {
        const [near, tether, tokenPrices] = await Promise.all([sendJson('GET', ACCOUNT_HELPER_URL + '/fiat'), sendJson('GET',url), fetchTokenPrices()]);

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
     
        return merge({}, near, tether, tokenFiatValues);
    } 
);

const getTokenWhiteList = createAsyncThunk(
    `${SLICE_NAME}/getTokenWhiteList`,
    async (account_id) => fetchTokenWhiteList(account_id)
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

                // Using merge instead of `assign()` so in the future we don't blow away previously loaded token
                // prices when we load new ones with different token names
                merge(state.tokens, action.payload);
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
    ({ tokens }) => tokens.tether || {}
);
export const selectUSDNTokenFiatValueUSD = createSelector(
    selectUSDNTokenFiatData,
    (tether) => tether.usd
);

export const selectTokensFiatValueUSD = createSelector(selectAllTokenFiatValues, ({ tokens }) => tokens || {});
export const selectTokenWhiteList = createSelector(selectAllTokenFiatValues, ({tokenWhiteList}) => tokenWhiteList || []);
