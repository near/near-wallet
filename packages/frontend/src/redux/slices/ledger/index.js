import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const SLICE_NAME = 'ledger';

const initialState = {
    modal: {}
};


const getLedgerAccountIds = createAsyncThunk(
    `${SLICE_NAME}/getLedgerAccountIds`,
    async ({ path }) => {
        return await wallet.getLedgerAccountIds(path);
    }
);

const addLedgerAccountId = createAsyncThunk(
    `${SLICE_NAME}/addLedgerAccountId`,
    async ({ accountId}) => {
        return await wallet.addLedgerAccountId(accountId);
    }
);

const saveAndSelectLedgerAccounts = createAsyncThunk(
    `${SLICE_NAME}/saveAndSelectLedgerAccounts`,
    async ({ accounts}) => {
        return await wallet.saveAndSelectLedgerAccounts(accounts);
    }
);

const ledgerSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setLedgerTxSigned(state, { payload, ready, error }) {
            const { signInWithLedger } = current(state);

            set(state, ['txSigned'], payload.status);

            if (!payload.accountId) {
                return;
            }
            if (!Object.keys(signInWithLedger || {}).length) {
                return;
            }
            if (signInWithLedger[payload.accountId].status === 'confirm' && payload.status) {
                set(state, ['signInWithLedger', payload.accountId, 'status'], 'pending');
            }
        },
    },
    extraReducers: ((builder) => {
    })
});

export default ledgerSlice;

export const actions = {
    ...ledgerSlice.actions
};
export const reducer = ledgerSlice.reducer;

// Top level selectors
export const selectLedgerSlice = (state) => state[SLICE_NAME];

export const selectLedgerTxSigned = createSelector(selectLedgerSlice, (ledger) => ledger.txSigned);

export const selectLedgerModal = createSelector(selectLedgerSlice, (ledger) => ledger.modal || {});

export const selectLedgerHasLedger = createSelector(selectLedgerSlice, (ledger) => ledger.hasLedger);

export const selectLedgerSignInWithLedger = createSelector(selectLedgerSlice, (ledger) => ledger.signInWithLedger);

export const selectLedgerSignInWithLedgerStatus = createSelector(selectLedgerSlice, (ledger) => ledger.signInWithLedgerStatus);
