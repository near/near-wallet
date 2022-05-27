import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import FungibleTokens from '../../../services/FungibleTokens';
import { createParameterSelector } from '../../selectors/topLevel';

const SLICE_NAME = 'tokensMetadata';

const initialState = {
    byContractName: {}
};

export async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName });
}

export const tokensMetadataSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['byContractName', contractName], metadata);
        }
    }
});

export default tokensMetadataSlice;

// Top level selectors
const selectTokensMetadataSlice = (state) => state.shared[SLICE_NAME] || initialState;

const getContractNameParam = createParameterSelector((params) => params.contractName);

export const selectContractsMetadata = createSelector(selectTokensMetadataSlice, ({ byContractName }) => byContractName);

export const selectOneContractMetadata = createSelector(
    [selectContractsMetadata, getContractNameParam],
    (metadataByContractName, contractName) => metadataByContractName[contractName]
);
