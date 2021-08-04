import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import set from 'lodash.set';
import update from 'lodash.update';
import { createSelector } from 'reselect';

import NonFungibleTokens from '../../services/NonFungibleTokens';

const { getLikelyTokenContracts, getMetadata, getTokens } = NonFungibleTokens;

const ENABLE_DEBUG = false;
const debugLog = (...args) => ENABLE_DEBUG && console.log('NFTSlice', ...args);

const initialState = {
    ownedTokens: {
        byAccountId: {}
    },
    metadata: {
        byContractName: {}
    }
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

const fetchNFTsByContractName = createAsyncThunk(
    'NFT/fetchNFTsByContractName',
    async ({ accountId, contractName }, thunkAPI) => {
        const { actions: { addTokensMetadata, setContractMetadata } } = nftSlice;
        const { dispatch, getState } = thunkAPI;

        const contractMetadata = await getCachedContractMetadataOrFetch(contractName, getState());
        debugLog({ contractMetadata });
        if (!selectOneContractMetadata(getState(), { contractName })) {
            await dispatch(setContractMetadata({ contractName, metadata: contractMetadata }));
        }
        
        const tokenMetadata = await getTokens({
            contractName,
            accountId,
            base_uri: contractMetadata.base_uri,
            fromIndex: selectTokensListForAccountForContract(getState(), { accountId, contractName }).length
        });
        const { payload } = await dispatch(addTokensMetadata({ accountId, contractName, tokens: tokenMetadata }));
        return payload;
    }
);

const fetchNFTs = createAsyncThunk(
    'NFT/fetchNFTs',
    async ({ accountId }, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const likelyContracts = await getLikelyTokenContracts(accountId);
        debugLog({ likelyContracts });

        await Promise.all(likelyContracts.map(async contractName => {
            try {
                await dispatch(fetchNFTsByContractName({ accountId, contractName }));
            } catch (e) {
                // Continue loading other likely contracts on failures
                console.warn(`Failed to load NFT for ${contractName}`, e);
            }
        }));
    }
);

const nftSlice = createSlice({
        name: 'NFT',
        initialState,
        reducers: {
            setContractMetadata(state, { payload }) {
                const { metadata, contractName } = payload;
                set(state, ['metadata', 'byContractName', contractName], metadata);
            },
            addTokensMetadata(state, { payload }) {
                const { contractName, tokens, accountId } = payload;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'numberOfFetchedTokens'], tokens.length);
                update(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'tokens'], (n) => (n || []).concat(tokens));
            },
            clearState(state) {
                state.ownedTokens = initialState.ownedTokens;
            }
        },
        extraReducers: ((builder) => {
            builder.addCase(fetchNFTsByContractName.pending, (state, { meta }) => {
                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], true);
            });
            builder.addCase(fetchNFTsByContractName.fulfilled, (state, { meta }) => {
                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], false);
            });
            builder.addCase(fetchNFTsByContractName.rejected, (state, { meta, error }) => {
                const { accountId, contractName } = meta.arg;
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'loading'], false);
                set(state, ['ownedTokens', 'byAccountId', accountId, 'byContractName', contractName, 'error'], error?.message || 'An error was encountered.');
            });
        })
    }
);

export default nftSlice;

export const actions = {
    fetchNFTs,
    fetchNFTsByContractName,
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
    (ownedTokensByContractName, contractName) => ownedTokensByContractName[contractName] || {}
);

export const selectTokensListForAccountForContract = createSelector(
    selectOwnedTokensForAccountForContract,
    (ownedTokensByAccountByContract) => ownedTokensByAccountByContract.tokens || []
);

export const selectLoadingTokensForAccountForContract = createSelector(
    selectOwnedTokensForAccountForContract,
    (ownedTokensByAccountByContract) => ownedTokensByAccountByContract.loading || false
);
);

// Returns owned tokens metadata for all tokens owned by the passed accountId, sorted by their `name` property
export const selectTokensWithMetadataForAccountId = createSelector(
    [selectAllContractMetadata, selectOwnedTokensForAccount],
    (metadataByContractName, ownedTokensByContractName) => {
        debugLog('selectTokensWithMetadataForAccountId()');
        const sortedOwnedTokensWithContractMetadata = Object.entries(ownedTokensByContractName || {})
            // First, sort the tokens this account owns by their `name` metadata
            .sort(([contractNameA], [contractNameB]) => {
                const contractMetadataNameA = metadataByContractName[contractNameA].name;
                const contractMetadataNameB = metadataByContractName[contractNameB].name;
                return contractMetadataNameA.localeCompare(contractMetadataNameB);
            })
            .map(([contractName, ownedTokensMetadata]) => ({
                contractName,
                contractMetadata: metadataByContractName[contractName] || {},
                ownedTokensMetadata
            }));

        return sortedOwnedTokensWithContractMetadata;
    }
);