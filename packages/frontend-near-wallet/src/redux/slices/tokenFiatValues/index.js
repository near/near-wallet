import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import mergeWith from 'lodash.mergewith';
import omit from 'lodash.omit';
import { createSelector } from 'reselect';

import FiatValueManager from '../../../utils/fiatValueManager';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';

const SLICE_NAME = 'tokenFiatValues';
const fiatValueManager = new FiatValueManager();

const fetchCoinGeckoFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchCoinGeckoFiatValues`,
    async (values) => fiatValueManager.fetchCoinGeckoPrices(values)
);
const fetchRefFinanceFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchRefFinanceFiatValues`,
    async () => fiatValueManager.fetchRefFinancePrices()
);
const fetchTokenFiatValues = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenFiatValues`,
    (_, {dispatch}) => Promise.all([
        dispatch(fetchCoinGeckoFiatValues(['near', 'usn'])),
        dispatch(fetchRefFinanceFiatValues()),
    ])
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
            builder.addCase(getTokenWhiteList.fulfilled, (state, action) => {
                state.tokenWhiteList = action.payload;
            });
            builder.addMatcher(
                isAnyOf(
                    fetchCoinGeckoFiatValues.fulfilled,
                    fetchRefFinanceFiatValues.fulfilled
                ),
                (state, action) => {
                    mergeWith(state.tokens, action.payload, (previous, fetched) =>
                        fetched?.last_updated_at > previous?.last_updated_at &&
                        !isEqual(omit(fetched, 'last_updated_at'), omit(previous, 'last_updated_at'))
                            ? fetched
                            : previous
                    );
                }
            );
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
