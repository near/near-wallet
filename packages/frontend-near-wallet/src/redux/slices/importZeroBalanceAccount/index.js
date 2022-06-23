import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

export const SLICE_NAME = 'importZeroBalanceAccount';

const initialState = {
    zeroBalanceAccountImportMethod: ''
};

const importZeroBalanceAccountSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setZeroBalanceAccountImportMethod: (state, action) => {
            state.zeroBalanceAccountImportMethod = action.payload;
        }
    }
});

export default importZeroBalanceAccountSlice;

export const actions = {
    ...importZeroBalanceAccountSlice.actions
};
export const reducer = importZeroBalanceAccountSlice.reducer;

const selectImportZeroBalanceAccountSlice = (state) => state[importZeroBalanceAccountSlice.name];
export const selectZeroBalanceAccountImportMethod = createSelector(selectImportZeroBalanceAccountSlice, ({ zeroBalanceAccountImportMethod }) => zeroBalanceAccountImportMethod);
