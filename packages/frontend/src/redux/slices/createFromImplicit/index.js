import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const SLICE_NAME = 'createFromImplicit';

const initialState = {
    createFromImplicitSuccess: false,
    createPersonalizedName: false
};

const createFromImplicitSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setCreateFromImplicitSuccess: (state, action) => {
            state.createFromImplicitSuccess = action.payload;
        },
        setCreatePersonalizedName: (state, action) => {
            state.createPersonalizedName = action.payload;
        }
    }
});

export default createFromImplicitSlice;

export const actions = {
    ...createFromImplicitSlice.actions
};
export const reducer = createFromImplicitSlice.reducer;

const selectCreateFromImplicitSlice = (state) => state[createFromImplicitSlice.name];
export const selectCreateFromImplicitSuccess = createSelector(selectCreateFromImplicitSlice, ({ createFromImplicitSuccess }) => createFromImplicitSuccess);
export const selectCreatePersonalizedName = createSelector(selectCreateFromImplicitSlice, ({ createPersonalizedName }) => createPersonalizedName);
