import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BN from 'bn.js';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import { WHITELISTED_CONTRACTS, IS_MAINNET} from '../../../config';
import FungibleTokens from '../../../services/FungibleTokens';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import { createParameterSelector, selectSliceByAccountId } from '../../selectors/topLevel';
import { selectUSDNTokenFiatValueUSD } from '../tokenFiatValues';
import tokensMetadataSlice, { getCachedContractMetadataOrFetch, selectContractsMetadata, selectOneContractMetadata } from '../tokensMetadata';

const currentContractName = !IS_MAINNET ? 'usdn.testnet': 'usn';

const SLICE_NAME = 'tokens';

const initialState = {
    ownedTokens: {}
};

const initialOwnedTokenState = {
    ...initialStatusState,
    balance: '',
};

const fetchOwnedTokensForContract = createAsyncThunk(
    `${SLICE_NAME}/fetchOwnedTokensForContract`,
    async ({ accountId, contractName }, thunkAPI) => {
        const {
            actions: { addTokensMetadata },
        } = tokensSlice;
        const { dispatch } = thunkAPI;

        const balance = await FungibleTokens.getBalanceOf({
            contractName,
            accountId,
        });

        dispatch(addTokensMetadata({ accountId, contractName, balance }));
    },
    {
        condition: ({ accountId, contractName }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (
                selectOneTokenLoading(getState(), { accountId, contractName })
            ) {
                return false;
            }
        },
    }
);

const fetchTokens = createAsyncThunk(
    `${SLICE_NAME}/fetchTokens`,
    async ({ accountId }, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;

        const likelyContracts = [
            ...new Set([
                ...(await FungibleTokens.getLikelyTokenContracts({
                    accountId,
                })),
                ...WHITELISTED_CONTRACTS,
            ]),
        ];


        await Promise.all(
            likelyContracts.map(async (contractName) => {
                const { actions: { setContractMetadata } } = tokensMetadataSlice;
                try {
                    const contractMetadata =
                        await getCachedContractMetadataOrFetch(
                            contractName,
                            getState()
                        );
                    if (
                        !selectOneContractMetadata(getState(), {
                            contractName,
                        })
                    ) {
                        dispatch(
                            setContractMetadata({
                                contractName,
                                metadata: contractMetadata,
                            })
                        );
                    }
                    await dispatch(
                        fetchOwnedTokensForContract({
                            accountId,
                            contractName,
                        })
                    );
                } catch (e) {
                    // Continue loading other likely contracts on failures
                    console.warn(`Failed to load FT for ${contractName}`, e);
                }
            })
        );
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
                await dispatch(
                    fetchOwnedTokensForContract({ accountId, contractName })
                );
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
        addTokensMetadata(state, { payload }) {
            const { contractName, balance } = payload;
            set(state, ['ownedTokens', contractName, 'balance'], balance);
        },
    },
    extraReducers: (builder) => {
        handleAsyncThunkStatus({
            asyncThunk: fetchOwnedTokensForContract,
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
const selectOwnedTokens = createSelector(selectTokensSlice, ({ ownedTokens }) => ownedTokens || {});

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
    ],
    (allContractMetadata, ownedTokensForAccount, usd) =>
        Object.entries(ownedTokensForAccount)
        .filter(([_, { balance }]) => !new BN(balance).isZero())
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
                    contractName === currentContractName ? { usd } : {},
            }))
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
