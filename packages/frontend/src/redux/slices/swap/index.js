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
<<<<<<< HEAD
            set(state, 'swapBycontractName', payload) 
=======
            set(state, 'swapBycontractName', payload); 
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        }
    }
});

<<<<<<< HEAD
export const { handleSwapBycontractName } = swapBycontractName.actions
=======
export const { handleSwapBycontractName } = swapBycontractName.actions;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

export default swapBycontractName;

export const reducer = swapBycontractName.reducer;

<<<<<<< HEAD
export const selectSwapBycontractName = (state) => state[SLICE_NAME].swapBycontractName;
=======
export const selectSwapBycontractName = (state) => state[SLICE_NAME].swapBycontractName;
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
