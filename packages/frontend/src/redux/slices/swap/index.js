import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';


const SLICE_NAME = 'swap';

const initialState = {
    swapByContractName: '',
};


const swapByContractName = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        handleSwapByContractName(state, { payload }) {
            set(state, 'swapByContractName', payload); 
        }
    }
});

export const { handleSwapByContractName } = swapByContractName.actions;

export default swapByContractName;

export const reducer = swapByContractName.reducer;

export const selectSwapByContractName = (state) => state[SLICE_NAME].swapByContractName;
