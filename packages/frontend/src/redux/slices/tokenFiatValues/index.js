import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DataLoader from 'dataloader';
import merge from 'lodash.merge';
import Cache from 'node-cache';
import { createSelector } from 'reselect';
import { stringifyUrl } from 'query-string';

import sendJson from '../../../tmp_fetch_send_json';
import { fetchTokenPrices, fetchTokenWhiteList } from '../../../utils/ref-finance';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const SLICE_NAME = 'tokenFiatValues';
const COINGECKO_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';

function wrapNodeCacheForDataloader(cache) {
    return {
        get: (...args) => {
            return cache.get(...args);
        },

        set: (...args) => {
            return cache.set(...args);
        },

        delete: (...args) => {
            return cache.del(...args);
        },

        clear: (...args) => {
            return cache.flushAll(...args);
        }

    };
}

class FiatValueManager {
    constructor(DataLoader) {
        this.fiatValueDataLoader = DataLoader;
    }

    async getPrice(tokens = ['near']) {
        const byTokenName = {};

        const prices = await this.fiatValueDataLoader.loadMany(tokens);
        tokens.forEach((tokenName, ndx) => byTokenName[tokenName] = prices[ndx]);

        return byTokenName;
    }
}

const fiatValueDataLoader = new DataLoader(
    async (tokenIds) => {
        const tokenFiatValues = await sendJson(
            'GET', 
            stringifyUrl({
                url: COINGECKO_PRICE_URL,
                query: {
                    ids: tokenIds.join(','),
                    vs_currencies: 'usd,eur,cny',
                    include_last_updated_at: true
                }
            })
        );

        return tokenIds.map((id) => tokenFiatValues[id]);
    },
    {
        /* 0 checkperiod means we only purge values from the cache on attempting to read an expired value
        Which allows us to avoid having to call `.close()` on the cache to allow node to exit cleanly */
        cacheMap: wrapNodeCacheForDataloader(new Cache({ stdTTL: 30, checkperiod: 0, useClones: false }))
    }
);

const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    async () => {
        const fiatValueManager = new FiatValueManager(fiatValueDataLoader);

        const [coinGeckoTokenFiatValues, refFinanceTokenFiatValues] = await Promise.allSettled([fiatValueManager.getPrice(['near']), fetchTokenPrices()]);

        const last_updated_at = Date.now() / 1000; 
        const otherTokenFiatValues = Object.keys(refFinanceTokenFiatValues).reduce((acc, curr) => {
            return ({
                ...acc,
                [curr]: {
                    usd: +Number(refFinanceTokenFiatValues[curr]?.price).toFixed(2) || null,
                    last_updated_at
                }
            });
        }, {});

        return merge({}, coinGeckoTokenFiatValues, otherTokenFiatValues);
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
