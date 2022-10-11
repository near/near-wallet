import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import set from 'lodash.set';
import { batch } from 'react-redux';

import { TEMPLATE_ACCOUNT_ID } from '../../../config';
import FungibleTokens from '../../../services/FungibleTokens';
import fungibleTokenExchange from '../../../services/tokenExchange';
import { formatTokenAmount } from '../../../utils/amounts';
import { wallet } from '../../../utils/wallet';
import { getBalance } from '../../actions/account';
import { showCustomAlert } from '../../actions/status';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import { getCachedContractMetadataOrFetch } from '../tokensMetadata';

const SLICE_NAME = 'swap';

const initialState = {
    tokenNames: [],
    tokens: {
        loading: false,
        all: {},
        withBalance: {},
    },
    pools: {
        loading: false,
        error: undefined,
        all: {},
    },
};

const sortTokens = (tokens, sortCallback) => {
    return Object.values(tokens)
        .sort(sortCallback)
        .reduce((allTokens, token) => ({ ...allTokens, [token.contractName]: token }), {});
};

const sortTokensInDecreasingOrderByPrice = (tokens) => {
    return sortTokens(tokens, (t1, t2) => {
        const price1 = t1.fiatValueMetadata?.usd;
        const balance1 = formatTokenAmount(
            t1.balance,
            t1.onChainFTMetadata.decimals
        );
        const price2 = t2.fiatValueMetadata?.usd;
        const balance2 = formatTokenAmount(
            t2.balance,
            t2.onChainFTMetadata.decimals
        );

        if (typeof price1 !== 'number') {
            return 1;
        }

        if (typeof price2 !== 'number') {
            return -1;
        }

        return balance2 * price2 - balance1 * price1;
    });
};

const updateTokensBalance = createAsyncThunk(
    `${SLICE_NAME}/updateTokensBalance`,
    async ({ accountId, tokenIds }, { getState, dispatch }) => {
        const { actions: { addTokens } } = swapSlice;
        const { swap: { tokens: { all } } } = getState();
        const updatedTokens = {};

        try {
            await Promise.allSettled(
                tokenIds.map(async (contractName) => {
                    const balance = await FungibleTokens.getBalanceOf({
                        contractName,
                        accountId,
                    });

                    updatedTokens[contractName] = {
                        ...all[contractName],
                        balance,
                    };
                })
            );
        } catch (error) {
            console.error('Error loading token balance', error);
        }

        batch(() => {
            dispatch(getBalance());
            dispatch(addTokens({ tokens: updatedTokens }));
        });
    }
);

const updateAllTokensData = createAsyncThunk(
    `${SLICE_NAME}/updateAllTokensData`,
    async (accountId, { getState, dispatch }) => {
        const { actions: { setAllTokensLoading, addAllTokens, addTokensWithBalance } } = swapSlice;
        const { tokenFiatValues, swap: { tokenNames } } = getState();
        const tokens = {};
        let tokensWithBalance = {};

        dispatch(setAllTokensLoading(true));

        try {
            await Promise.allSettled(
                tokenNames.map(async (contractName) => {
                    const onChainFTMetadata = await getCachedContractMetadataOrFetch(
                        contractName,
                        getState()
                    );
                    let balance = '';

                    if (accountId) {
                        balance = await FungibleTokens.getBalanceOf({
                            contractName,
                            accountId,
                        });
                    }

                    const config = {
                        contractName,
                        balance,
                        onChainFTMetadata,
                        fiatValueMetadata: tokenFiatValues.tokens[contractName] || {},
                    };

                    tokens[contractName] = config;

                    if (balance > 0) {
                        tokensWithBalance[contractName] = config;
                    }
                })
            );
        } catch (error) {
            console.error('Error loading token data', error);
        }

        batch(() => {
            dispatch(
                addTokensWithBalance({
                    tokens: sortTokensInDecreasingOrderByPrice(
                        tokensWithBalance
                    ),
                })
            );
            dispatch(
                addAllTokens({
                    tokens: sortTokensInDecreasingOrderByPrice(tokens),
                })
            );
            dispatch(setAllTokensLoading(false));
        });
    }
);

const fetchSwapData = createAsyncThunk(
    `${SLICE_NAME}/fetchSwapData`,
    async ({ accountId }, { dispatch }) => {
        const {
            actions: { setPoolsLoading, setPoolsError, addPools, addTokenNames },
        } = swapSlice;

        dispatch(setPoolsLoading(true));

        try {
            const account = wallet.getAccountBasic(TEMPLATE_ACCOUNT_ID);
            const { pools, tokens } = await fungibleTokenExchange.getData({
                account,
            });

            batch(() => {
                dispatch(addTokenNames({ tokenNames: tokens }));
                dispatch(addPools({ pools }));
                dispatch(setPoolsLoading(false));
                dispatch(updateAllTokensData(accountId));
            });
        } catch (error) {
            console.error('Error loading swap data', error);
            dispatch(
                showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    messageCode: 'swap.errorToFetchData',
                    errorMessage: error.message,
                })
            );

            if (error?.message) {
                setPoolsError(error.message);
            }
        }
    }
);

const swapSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setPoolsLoading(state, { payload }) {
            set(state, ['pools', 'loading'], payload);
        },
        setPoolsError(state, { payload }) {
            set(state, ['pools', 'error'], payload);
        },
        addPools(state, { payload }) {
            const { pools } = payload;

            set(state, ['pools', 'all'], pools);
        },
        addTokenNames(state, { payload }) {
            const { tokenNames } = payload;

            set(state, ['tokenNames'], tokenNames);
        },
        setAllTokensLoading(state, { payload }) {
            set(state, ['tokens', 'loading'], payload);
        },
        addAllTokens(state, { payload }) {
            const { tokens } = payload;

            set(state, ['tokens', 'all'], tokens);
        },
        addTokensWithBalance(state, { payload }) {
            const { tokens } = payload;

            set(state, ['tokens', 'withBalance'], tokens);
        },
        addTokens(state, { payload }) {
            const { tokens } = payload;

            merge(state, { tokens: { all: tokens } });
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchSwapData,
            buildStatusPath: () => [],
            builder,
        });
    },
});

export default swapSlice;

export const actions = {
    fetchSwapData,
    updateTokensBalance,
    ...swapSlice.actions
};

export const reducer = swapSlice.reducer;

const selectTokens = (state) => state[SLICE_NAME].tokens;
const selectAllTokenLoading = (state) => state[SLICE_NAME].tokens.loading;
const selectPools = (state) => state[SLICE_NAME].pools;

export const selectAllTokens = createSelector(selectTokens, ({ all }) => all);
export const selectTokensWithBalance = createSelector(selectTokens, ({ withBalance }) => withBalance);
export const selectAllTokensLoading = createSelector(selectAllTokenLoading, (loading) => loading);

export const selectAllPools = createSelector(selectPools, ({ all }) => all);
export const selectPoolsLoading = createSelector(
    selectPools,
    ({ loading }) => loading
);
export const selectPoolsError = createSelector(
    selectPools,
    ({ error }) => error
);
