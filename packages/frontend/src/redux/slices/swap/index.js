import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';


const SLICE_NAME = 'swap';

const initialState = {
    swapBycontractName: '',
};


const swapBycontractName = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        handleSwapBycontractName(state, { payload }) {
            set(state, 'swapBycontractName', payload); 
        }
    }
});

export const { handleSwapBycontractName } = swapBycontractName.actions;

export default swapBycontractName;

export const reducer = swapBycontractName.reducer;

export const selectSwapBycontractName = (state) => state[SLICE_NAME].swapBycontractName;
