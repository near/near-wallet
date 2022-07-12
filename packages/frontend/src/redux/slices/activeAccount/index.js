import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

const SLICE_NAME = 'activeAccount';

const initialState = {
    accountId: ''
};

const activeAccountSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setAccountId(state, { payload }) {
            const { accountId } = payload;
            set(state, ['accountId'], accountId);
        },
    },
});

export default activeAccountSlice;

export const actions = {
    ...activeAccountSlice.actions,
};
export const reducer = activeAccountSlice.reducer;

const selectActiveAccountSlice = (state) => state.accounts[activeAccountSlice.name];

export const selectActiveAccountId = createSelector(
    selectActiveAccountSlice,
    (activeAccount) => activeAccount.accountId
);
