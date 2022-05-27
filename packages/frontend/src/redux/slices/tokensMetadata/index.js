import { createSlice } from '@reduxjs/toolkit';
const SLICE_NAME = 'tokensMetadata';

const initialState = {
    byContractName: {}
};

export const tokensMetadataSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
    }
});
