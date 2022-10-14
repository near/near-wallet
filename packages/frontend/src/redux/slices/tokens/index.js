import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bn.js';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import { WHITELISTED_CONTRACTS, USN_CONTRACT } from '../../../config';
import FungibleTokens from '../../../services/FungibleTokens';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import selectNEARAsTokenWithMetadata from '../../selectors/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { createParameterSelector, selectSliceByAccountId } from '../../selectors/topLevel';
import { selectSetOfBlacklistedTokenNames } from '../security';
import { selectUSDNTokenFiatValueUSD, selectTokensFiatValueUSD } from '../tokenFiatValues';
import tokensMetadataSlice, { getCachedContractMetadataOrFetch, selectContractsMetadata, selectOneContractMetadata } from '../tokensMetadata';

const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {},
    withBalance: {},
};

const initialOwnedTokenState = {
    ...initialStatusState,
    balance: '',
    onChainFTMetadata: {},
    fiatValueMetadata: {},
};

const fetchTokenBalance = createAsyncThunk(
    `${SLICE_NAME}/fetchTokenBalance`,
    async ({ accountId, contractName }, thunkAPI) => {
        const {
            actions: { setTokenBalance },
        } = tokensSlice;
        const { dispatch } = thunkAPI;

        const balance = await FungibleTokens.getBalanceOf({
            contractName,
            accountId,
        });

        dispatch(setTokenBalance({ accountId, contractName, balance }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (selectOneTokenLoading(getState(), { accountId, contractName })) {
                return false;
            }
        },
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        const { actions: { addToken, addTokenWithBalance } } = tokensSlice;
        const { tokenFiatValues } = getState();

        const likelyContracts = [...new Set([...(await FungibleTokens.getLikelyTokenContracts({ accountId })), ...WHITELISTED_CONTRACTS])];

        await Promise.all(likelyContracts.map(async (contractName) => {
            const { actions: { setContractMetadata } } = tokensMetadataSlice;

            try {
                const onChainFTMetadata = await getCachedContractMetadataOrFetch(contractName, getState());
                const balance = await FungibleTokens.getBalanceOf({
                    contractName,
                    accountId,
                });

                if (!selectOneContractMetadata(getState(), { contractName })) {
                    dispatch(setContractMetadata({
                        contractName,
                        metadata: onChainFTMetadata,
                    }));
                }

                const config = {
                    contractName,
                    data: {
                        contractName,
                        balance,
                        onChainFTMetadata,
                        fiatValueMetadata: tokenFiatValues.tokens[contractName] || {},
                    },
                };

                if (Number(balance)) {
                    dispatch(addTokenWithBalance(config));
                } else {
                    dispatch(addToken(config));
                }
            } catch (e) {
                // Continue loading other likely contracts on failures
                console.warn(`Failed to load FT for ${contractName}`, e);
            }
        }));
    }
);

const fetchToken = createAsyncThunk(
    `${SLICE_NAME}/fetchToken`,
    async ({ contractName, accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        const { actions: { setContractMetadata } } = tokensMetadataSlice;
        try {
            const contractMetadata = await getCachedContractMetadataOrFetch(
                contractName,
                getState()
            );
            if (!selectOneContractMetadata(getState(), { contractName })) {
                dispatch(
                    setContractMetadata({
                        contractName,
                        metadata: contractMetadata,
                    })
                );
            }
            if (accountId) {
                await dispatch(fetchTokenBalance({ accountId, contractName }));
            }
        } catch (e) {
            // Continue loading other likely contracts on failures
            console.warn(`Failed to load FT for ${contractName}`, e);
        }
    }
);

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        addToken(state, { payload }) {
            const { contractName, data } = payload;

            set(state, ['ownedTokens', contractName], data);
        },
        addTokenWithBalance(state, { payload }) {
            const { contractName, data } = payload;

            set(state, ['ownedTokens', contractName], data);
            set(state, ['withBalance', contractName], data);
        },
        setTokenBalance(state, { payload }) {
            const { contractName, balance } = payload;

            set(state, ['ownedTokens', contractName, 'balance'], balance);
        },
        setBlacklistedTokens(state, { payload }) {
            set(state, ['blacklisted'], payload);
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchTokenBalance,
            buildStatusPath: ({ meta: { arg: { contractName }}}) => ['ownedTokens', contractName],
            builder
        });
    },
});

export default tokensSlice;

export const actions = {
    fetchToken,
    fetchTokens,
    ...tokensSlice.actions,
};
export const reducer = tokensSlice.reducer;

// Top level selectors
const selectTokensSlice = selectSliceByAccountId(SLICE_NAME, initialState);
const selectOwnedTokens = createSelector(selectTokensSlice, ({ ownedTokens }) => ownedTokens);
const selectTokensWithBalance = createSelector(selectTokensSlice, ({ withBalance }) => withBalance);

const getContractNameParam = createParameterSelector(
    (params) => params.contractName
);

export const selectOneTokenFromOwnedTokens = createSelector(
    [selectOwnedTokens, getContractNameParam],
    (ownedTokens, contractName) => ownedTokens[contractName] || initialOwnedTokenState
);

export const selectTokensWithMetadataForAccountId = createSelector(
    [
        selectContractsMetadata,
        selectOwnedTokens,
        selectUSDNTokenFiatValueUSD,
        (_, params) => params.showTokensWithZeroBalance
    ],
    (allContractMetadata, ownedTokensForAccount, usd, showTokensWithZeroBalance) => {
        let tokenEntries = Object.entries(ownedTokensForAccount);
        if (!showTokensWithZeroBalance) {
            tokenEntries = tokenEntries.filter(([_, { balance }]) => !new BN(balance).isZero());
        }
        return tokenEntries
            .sort(([a], [b]) =>
                allContractMetadata[a]?.name.localeCompare(
                    allContractMetadata[b]?.name
                )
            )
            .map(([contractName, { balance }]) => ({
                ...initialOwnedTokenState,
                contractName,
                balance,
                onChainFTMetadata: allContractMetadata[contractName] || {},
                fiatValueMetadata:
                    contractName === USN_CONTRACT ? { usd } : {},
            }));
    });

export const selectAllowedTokens = createSelector(
    [selectTokensFiatValueUSD, selectTokensWithBalance, selectSetOfBlacklistedTokenNames, selectNEARAsTokenWithMetadata],
    (tokensFiatData, tokensWithBalance, setOfBlacklistedNames, nearConfig) => {
        const tokenList = Object.values(tokensWithBalance).map((tokenData) => ({
            ...tokenData,
            fiatValueMetadata: tokensFiatData[tokenData.contractName] || {},
        }));

        if (![...setOfBlacklistedNames].length) {
            return [nearConfig, ...tokenList];
        }

        const allowedTokens = tokenList.filter(
            ({ contractName }) => !setOfBlacklistedNames.has(contractName)
        );

        return [nearConfig, ...allowedTokens];
    }
);

export const selectTokensLoading = createSelector(
    [selectOwnedTokens],
    (ownedTokens) => Object.entries(ownedTokens)
        .some(([_, { status: { loading } = {}}]) => loading)
);

const selectOneTokenLoading = createSelector(
    [selectOneTokenFromOwnedTokens],
    (token) => token.status.loading
);
