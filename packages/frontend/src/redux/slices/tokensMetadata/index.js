import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
const SLICE_NAME = 'tokensMetadata';

const initialState = {
    byContractName: {}
};
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
