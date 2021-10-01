import { createSelector } from "reselect";

const SLICE_NAME = 'ledger';

// Top level selectors
export const selectLedgerSlice = (state) => state[SLICE_NAME];

export const selectLedgerTxSigned = createSelector(selectLedgerSlice, (ledger) => ledger.txSigned);

export const selectLedgerModal = createSelector(selectLedgerSlice, (ledger) => ledger.modal || {});

export const selectLedgerHasLedger = createSelector(selectLedgerSlice, (ledger) => ledger.hasLedger);

export const selectLedgerSignInWithLedger = createSelector(selectLedgerSlice, (ledger) => ledger.signInWithLedger);

