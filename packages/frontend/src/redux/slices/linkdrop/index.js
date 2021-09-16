import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const SLICE_NAME = 'linkdrop';

const initialState = {
    amount: '0'
};

const linkdropSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setLinkdropAmount: (state, action) => {
            state.amount = action.payload;
        }
    }
});

export default linkdropSlice;

export const actions = {
    ...linkdropSlice.actions
};
export const reducer = linkdropSlice.reducer;

const selectLinkdropSlice = (state) => state[linkdropSlice.name];
export const selectLinkdropAmount = createSelector(selectLinkdropSlice, ({ amount }) => amount);
