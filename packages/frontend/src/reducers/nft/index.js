import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import update from 'lodash.update';
import { createSelector } from 'reselect';

import { switchAccount } from '../../redux/slices/account';
import NonFungibleTokens, { TOKENS_PER_PAGE } from '../../services/NonFungibleTokens';

const { getLikelyTokenContracts, getMetadata, getTokens } = NonFungibleTokens;

const SLICE_NAME = 'NFT';
const ENABLE_DEBUG = false;
const debugLog = (...args) => ENABLE_DEBUG && console.log(`${SLICE_NAME}Slice`, ...args);

const initialState = {
    ownedTokens: {
        byAccountId: {}
    },
    metadata: {
        byContractName: {}
    }
};

const initialOwnedTokenState = {
    error: null,
    loading: false,
    tokens: [],
    hasFetchedAllTokensForContract: false
};

async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        debugLog('Returning cached contract metadata', { contractName });
        return contractMetadata;
    }
    debugLog('Fetching contract metadata', { contractName });
    return getMetadata(contractName);
}

const fetchOwnedNFTsForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedNFTsForContract`,
    async ({ accountId, contractName, contractMetadata }, thunkAPI) => {
        debugLog('THUNK/fetchOwnedNFTsForContract');
        const { actions: { addTokensMetadata } } = nftSlice;
        const { dispatch, getState } = thunkAPI;

        const tokenMetadata = await getTokens({
            contractName,
            accountId,
            base_uri: contractMetadata.base_uri,
            fromIndex: selectTokensListForAccountForContract(getState(), { accountId, contractName }).length
        });
        await dispatch(addTokensMetadata({ accountId, contractName, tokens: tokenMetadata }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (selectLoadingTokensForAccountForContract(getState(), { accountId, contractName })) {
                return false;
            }
        }
    }
);

const fetchNFTs = createAsyncThunk(
    `${SLICE_NAME}/fetchNFTs`,
    async ({ accountId }, thunkAPI) => {
        debugLog('THUNK/fetchNFTs');

        const { dispatch, getState } = thunkAPI;

        const likelyContracts = await getLikelyTokenContracts(accountId);
        debugLog({ likelyContracts });

        await Promise.all(likelyContracts.map(async contractName => {
            const { actions: { setContractMetadata } } = nftSlice;
            try {
                const contractMetadata = await getCachedContractMetadataOrFetch(contractName, getState());
                debugLog({ contractMetadata });
                if (!selectOneContractMetadata(getState(), { contractName })) {
                    debugLog('THUNK/fetchNFTs', 'Dispatching setContractMetadata');
                    await dispatch(setContractMetadata({ contractName, metadata: contractMetadata }));
                }

                await dispatch(fetchOwnedNFTsForContract({ accountId, contractName, contractMetadata }));
            } catch (e) {
                // Continue loading other likely contracts on failures
                console.warn(`Failed to load NFT for ${contractName}`, e);
            }
        }));
    }
);

const nftSlice = createSlice({
        name: SLICE_NAME,
        initialState,
        reducers: {
            setContractMetadata(state, { payload }) {
                debugLog('REDUCER/setContractMetadata');
                const { metadata, contractName } = payload;
                set(state, ['metadata', 'byContractName', contractName], metadata);
            },
            addTokensMetadata(state, { payload }) {
                debugLog('REDUCER/addTokensMetadata');

                const { contractName, tokens, accountId } = payload;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'hasFetchedAllTokensForContract'], tokens.length < TOKENS_PER_PAGE);
                update(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'tokens'], (n) => (n || []).concat(tokens));
            },
            clearState(state) {
                debugLog('REDUCER/clearState');

                state.ownedTokens = initialState.ownedTokens;
            }
        },
        extraReducers: ((builder) => {
            builder.addCase(fetchOwnedNFTsForContract.pending, (state, { meta }) => {
                debugLog('REDUCER/fetchOwnedNFTsForContract.pending');
                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], true);
            });
            builder.addCase(fetchOwnedNFTsForContract.fulfilled, (state, { meta }) => {
                debugLog('REDUCER/fetchOwnedNFTsForContract.fulfilled');

                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], false);
            });
            builder.addCase(fetchOwnedNFTsForContract.rejected, (state, { meta, error }) => {
                debugLog('REDUCER/fetchOwnedNFTsForContract.fulfilled');

                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], false);
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'error'], error?.message || 'An error was encountered.');
            });
            builder.addCase(switchAccount.fulfilled, (state) => {
                state.ownedTokens = initialState.ownedTokens;
            });
        })
    }
);

export default nftSlice;

export const actions = {
    fetchNFTs,
    fetchOwnedNFTsForContract,
    ...nftSlice.actions
};
export const reducer = nftSlice.reducer;

// A helper function to create the parameter selectors
// Ref: https://flufd.github.io/reselect-with-multiple-parameters/
function createParameterSelector(selector) {
    return (_, params) => selector(params);
}

const getAccountIdParam = createParameterSelector((params) => params.accountId);

// Top level selectors
const selectNftSlice = (state) => state[nftSlice.name];
const selectMetadataSlice = createSelector(selectNftSlice, ({ metadata }) => metadata);
const selectOwnedTokensSlice = createSelector(selectNftSlice, ({ ownedTokens }) => ownedTokens);

// Contract metadata selectors
// Returns contract metadata for every contract in the store, in an object keyed by contractName
export const selectAllContractMetadata = createSelector(
    selectMetadataSlice,
    (metadata) => metadata.byContractName
);

const getContractNameParam = createParameterSelector((params) => params.contractName);

// Returns contract metadata for only the contractName provided
export const selectOneContractMetadata = createSelector(
    [selectAllContractMetadata, getContractNameParam],
    (metadataByContractName, contractName) => metadataByContractName[contractName]
);

// Owned tokens selectors
const selectOwnedTokensForAccount = createSelector(
    [selectOwnedTokensSlice, getAccountIdParam],
    (ownedTokensByAccountId, accountId) => (ownedTokensByAccountId.byAccountId[accountId] || {}).byContractName || {}
);

const selectOwnedTokensForAccountForContract = createSelector(
    [selectOwnedTokensForAccount, getContractNameParam],
    (ownedTokensByContractName, contractName) => ({
        ...initialOwnedTokenState,
        ...ownedTokensByContractName[contractName]
    })
);

const selectTokensListForAccountForContract = createSelector(
    selectOwnedTokensForAccountForContract,
    (ownedTokensByAccountByContract) => ownedTokensByAccountByContract.tokens
);

export const selectLoadingTokensForAccountForContract = createSelector(
    selectOwnedTokensForAccountForContract,
    (ownedTokensByAccountByContract) => ownedTokensByAccountByContract.loading
);

export const selectHasFetchedAllTokensForAccountForContract = createSelector(
    selectOwnedTokensForAccountForContract,
    (ownedTokensByAccountByContract) => ownedTokensByAccountByContract.hasFetchedAllTokensForContract
);

// Returns owned tokens metadata for all tokens owned by the passed accountId, sorted by their `name` property
export const selectTokensWithMetadataForAccountId = createSelector(
    [selectAllContractMetadata, selectOwnedTokensForAccount],
    (metadataByContractName, ownedTokensByContractName) => {
        debugLog('selectTokensWithMetadataForAccountId');

        return Object.entries(ownedTokensByContractName)
            // First, sort the tokens this account owns by their contract's `name` metadata - NOT their contract name itself
            .sort(([contractNameA], [contractNameB]) => {
                const contractMetadataNameA = metadataByContractName[contractNameA].name;
                const contractMetadataNameB = metadataByContractName[contractNameB].name;
                return contractMetadataNameA.localeCompare(contractMetadataNameB);
            })
            .map(([contractName, ownedTokensMetadata]) => ({
                contractName,
                contractMetadata: metadataByContractName[contractName] || {},
                ownedTokensMetadata: ownedTokensMetadata.tokens
            }));
    }
);