import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import isEqual from 'lodash.isequal';
import mergeWith from 'lodash.mergewith';
import omit from 'lodash.omit';
import { createSelector } from 'reselect';

import FungibleTokens from '../../../services/FungibleTokens';
import FiatValueManager from '../../../utils/fiatValueManager';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import { getCachedContractMetadataOrFetch } from '../tokensMetadata';

// this error would surface if the developer of a token smart contract does not implement the necessary ft_metadata method
const METHOD_NOT_FOUND_ERROR = 'Querying [object Object] failed: wasm execution failed with error: FunctionCallError(MethodResolveError(MethodNotFound)).';

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
    async ({accountId}, {dispatch, getState}) => {
        const ownedTokens = [];
        if (accountId) {
            const likelyContracts = await FungibleTokens.getLikelyTokenContracts({ accountId });
            await Promise.allSettled(likelyContracts.map(async (contractName) => {
                let symbol;
                try {
                    const metadata = await getCachedContractMetadataOrFetch(contractName, getState());
                    symbol = metadata.symbol;
                } catch (error) {
                    if (!error.message.includes(METHOD_NOT_FOUND_ERROR)) {
                        console.log(`Unknown error fetching fiat value for ${contractName}`, error.message);
                    }
                    throw Error;
                } finally {
                    if (symbol) {
                        ownedTokens.push(symbol);
                    }
                }
            }));
        }
        return Promise.all([
            dispatch(fetchCoinGeckoFiatValues([...ownedTokens, 'near'])),
            dispatch(fetchRefFinanceFiatValues()),
        ]);
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
