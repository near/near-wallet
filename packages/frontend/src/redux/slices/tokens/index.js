import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bn.js';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import { WHITELISTED_CONTRACTS } from '../../../config';
import FungibleTokens from '../../../services/FungibleTokens';
import createParameterSelector from '../createParameterSelector';
import initialErrorState from '../initialErrorState';

const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {
        byAccountId: {}
    },
    metadata: {
        byContractName: {}
    }
};

const initialOwnedTokenState = {
    balance: '',
    loading: false,
    error: initialErrorState
};

async function getCachedContractMetadataOrFetch(contractName, accountId, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName, accountId });
}

const fetchOwnedTokensForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedTokensForContract`,
    async ({ accountId, contractName }, thunkAPI) => {
        const { actions: { addTokensMetadata } } = tokensSlice;
        const { dispatch } = thunkAPI;

        const balance = await FungibleTokens.getBalanceOf({ contractName, accountId });

        dispatch(addTokensMetadata({ accountId, contractName, balance }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (selectOneTokenLoading(getState(), { accountId, contractName })) {
                return false;
            }
        }
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const likelyContracts = [...new Set([...(await FungibleTokens.getLikelyTokenContracts({ accountId })), ...WHITELISTED_CONTRACTS])];

        await Promise.all(likelyContracts.map(async contractName => {
            const { actions: { setContractMetadata } } = tokensSlice;
            try {
                const contractMetadata = await getCachedContractMetadataOrFetch(contractName, accountId, getState());
                if (!selectOneContractMetadata(getState(), { contractName })) {
                    dispatch(setContractMetadata({ contractName, metadata: contractMetadata }));
                }
                await dispatch(fetchOwnedTokensForContract({ accountId, contractName, contractMetadata }));
            } catch (e) {
                // Continue loading other likely contracts on failures
                console.warn(`Failed to load FT for ${contractName}`, e);
            }
        }));
    }
);

const tokensSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['metadata', 'byContractName', contractName], metadata);
        },
        addTokensMetadata(state, { payload }) {
            const { contractName, balance, accountId } = payload;
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'balance'], balance);
        },
    },
    extraReducers: ((builder) => {
        builder.addCase(fetchOwnedTokensForContract.pending, (state, { meta }) => {
            const { accountId, contractName } = meta.arg;

            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'loading'], true);
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'error'], initialErrorState);
        });
        builder.addCase(fetchOwnedTokensForContract.fulfilled, (state, { meta }) => {
            const { accountId, contractName } = meta.arg;

            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'loading'], false);
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'error'], initialErrorState);
        });
        builder.addCase(fetchOwnedTokensForContract.rejected, (state, { meta,  error }) => {
            const { accountId, contractName } = meta.arg;
            
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'loading'], false);
            set(state, ['ownedTokens', 'byAccountId', accountId, contractName, 'error'], {
                message: error?.message || 'An error was encountered.',
                code: error?.code
            });
        });
    })
});

export default tokensSlice;

export const actions = {
    fetchTokens,
    ...tokensSlice.actions
};
export const reducer = tokensSlice.reducer; 

const getAccountIdParam = createParameterSelector((params) => params.accountId);

// Top level selectors
const selectTokensSlice = (state) => state[tokensSlice.name];
const selectMetadataSlice = createSelector(selectTokensSlice, ({ metadata }) => metadata || {});
const selectOwnedTokensSlice = createSelector(selectTokensSlice, ({ ownedTokens }) => ownedTokens);

// Contract metadata selectors
// Returns contract metadata for every contract in the store, in an object keyed by contractName
export const selectAllContractMetadata = createSelector(
    selectMetadataSlice,
    (metadata) => metadata.byContractName || {}
);

const getContractNameParam = createParameterSelector((params) => params.contractName);

export const selectOneContractMetadata = createSelector(
    [selectAllContractMetadata, getContractNameParam],
    (metadataByContractName, contractName) => metadataByContractName[contractName]
);

const selectOwnedTokensForAccount = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) => ownedTokens.byAccountId[accountId] || {}
);

export const selectOneTokenFromOwnedTokens = createSelector(
    [selectOwnedTokensForAccount, getContractNameParam],
    (ownedTokensForAccount, contractName) => ownedTokensForAccount[contractName] || initialOwnedTokenState
);

export const selectTokensWithMetadataForAccountId = createSelector(
    [selectAllContractMetadata, selectOwnedTokensForAccount],
    (allContractMetadata, ownedTokensForAccount) => Object.entries(ownedTokensForAccount)
        .filter(([_, { balance }]) => !new BN(balance).isZero())
        .sort(([a], [b]) => allContractMetadata[a].name.localeCompare(allContractMetadata[b].name))
        .map(([contractName, { balance }]) => ({
            ...initialOwnedTokenState,
            contractName,
            balance,
            ...(allContractMetadata[contractName] || {})
        }))
);

export const selectTokensLoading = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokens, accountId) => Object.entries(ownedTokens.byAccountId[accountId] || {})
        .some(([_, { loading }]) => loading)
);

const selectOneTokenLoading = createSelector(
    [selectOneTokenFromOwnedTokens],
    (token) => token.loading
);
