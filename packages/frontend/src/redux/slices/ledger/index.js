import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import set from 'lodash.set';
import unset from 'lodash.unset';
import { createSelector } from "reselect";

import { HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL } from "../../../config";
import { showAlertToolkit } from "../../../utils/alerts";
import { setLedgerHdPath } from "../../../utils/localStorage";
import { wallet } from "../../../utils/wallet";
import refreshAccountOwner from "../../sharedThunks/refreshAccountOwner";
import handleAsyncThunkStatus from "../handleAsyncThunkStatus";
import initialErrorState from "../initialErrorState";

const SLICE_NAME = 'ledger';

export const LEDGER_MODAL_STATUS = {
    CONFIRM_PUBLIC_KEY: 'confirm-public-key',
    CONFIRM_ACCOUNTS: 'confirm-accounts',
    ENTER_ACCOUNTID: 'enter-accountId'
};

const initialState = {
    modal: {},
    status: {
        loading: false,
        error: initialErrorState
    }
};

const getLedgerAccountIds = createAsyncThunk(
    `${SLICE_NAME}/getLedgerAccountIds`,
    async ({ path }) => await wallet.getLedgerAccountIds({ path }),
    showAlertToolkit({ onlyError: true })
);

const addLedgerAccountId = createAsyncThunk(
    `${SLICE_NAME}/addLedgerAccountId`,
    async ({ accountId}) => await wallet.addLedgerAccountId({ accountId }),
    showAlertToolkit()
);

const saveAndSelectLedgerAccounts = createAsyncThunk(
    `${SLICE_NAME}/saveAndSelectLedgerAccounts`,
    async ({ accounts}) => await wallet.saveAndSelectLedgerAccounts({ accounts }),
    showAlertToolkit()
);

const signInWithLedgerAddAndSaveAccounts = createAsyncThunk(
    `${SLICE_NAME}/signInWithLedgerAddAndSaveAccounts`,
    async ({ path, accountIds }, { dispatch, getState }) => {
        for (let accountId of accountIds) {
            try {
                if (path) {
                    setLedgerHdPath({ accountId, path });
                }
                await dispatch(addLedgerAccountId({ accountId }));
                dispatch(ledgerSlice.actions.setLedgerTxSigned({ status: false, accountId }));
            } catch (e) {
                console.warn('Error importing Ledger-based account', accountId, e);
                // NOTE: We still continue importing other accounts
            }
        }
        return dispatch(saveAndSelectLedgerAccounts({ accounts: selectLedgerSignInWithLedger(getState()) }));
    }
);

const checkAndHideLedgerModal = createAsyncThunk(
    `${SLICE_NAME}/checkAndHideLedgerModal`,
    async (_, { dispatch, getState }) => {
        if (selectLedgerModalShow(getState())) {
            dispatch(ledgerSlice.actions.hideLedgerModal());
        }
    }
);

const signInWithLedger = createAsyncThunk(
    `${SLICE_NAME}/signInWithLedger`,
    async ({ path }, { dispatch, getState }) => {
        dispatch(ledgerSlice.actions.setLedgerTxSigned({ status: true }));
        await dispatch(getLedgerAccountIds({ path })).unwrap();

        const accountIds = Object.keys(selectLedgerSignInWithLedger(getState()));
        await dispatch(signInWithLedgerAddAndSaveAccounts({ path, accountIds }));
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
        clearSignInWithLedgerModalState(state, { payload, ready, error }) {
            unset(state, ['txSigned']);
            unset(state, ['signInWithLedgerStatus']);
            unset(state, ['signInWithLedger']);
        },
        showLedgerModal(state, { payload, ready, error }) {
            const { signInWithLedgerStatus } = current(state);

            unset(state, ['txSigned']);
            set(state, ['modal', 'show'], !signInWithLedgerStatus && payload.show);
            set(state, ['modal', 'action'], payload.action);
            set(state, ['modal', 'textId'], 'ledgerSignTxModal.DEFAULT');
        },
        hideLedgerModal(state, { payload, ready, error }) {
            set(state, ['modal'], {});
            unset(state, ['txSigned']);
        },
    },
    extraReducers: ((builder) => {
        // getLedgerAccountIds
        builder.addCase(getLedgerAccountIds.pending, (state) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY);
        });
        builder.addCase(getLedgerAccountIds.fulfilled, (state, { payload }) => {
            unset(state, ['txSigned']);
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS);
            payload.forEach(accountId => 
                set(state, ['signInWithLedger', accountId, 'status'], 'waiting')
            );
        });
        builder.addCase(getLedgerAccountIds.rejected, (state, { error }) => {
            const noAccounts = error.message === 'No accounts were found.' && !HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL;

            set(state, ['signInWithLedgerStatus'], noAccounts ? LEDGER_MODAL_STATUS.ENTER_ACCOUNTID : undefined);
            unset(state, ['signInWithLedger']);
            unset(state, ['txSigned']);
        });
        // addLedgerAccountId
        builder.addCase(addLedgerAccountId.pending, (state, { payload, meta: { arg: { accountId } } }) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS);
            set(state, ['signInWithLedger', accountId, 'status'], 'confirm');
        });
        builder.addCase(addLedgerAccountId.fulfilled, (state, { payload, meta: { arg: { accountId } } }) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS);
            set(state, ['signInWithLedger', accountId, 'status'], 'success');
        });
        builder.addCase(addLedgerAccountId.rejected, (state, { error, meta: { arg: { accountId } } }) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS);

            const transportError = error?.name === 'TransportStatusError';
            set(state, ['signInWithLedger', accountId, 'status'], transportError ? 'rejected' : 'error');
        });
        // refreshAccountOwner
        builder.addCase(refreshAccountOwner.fulfilled, (state, { payload }) => {
            set(state, ['hasLedger'], payload.ledger.hasLedger);
            set(state, ['ledgerKey'], payload.ledger.ledgerKey);
        });
        // matcher to handle closing modal automatically
        builder.addMatcher(
            ({ type, ready, error }) => ready || error || type.endsWith('/rejected') || type.endsWith('/fulfilled'),
            (state, { type }) => {
                const { modal } = current(state);
                if (modal.show && type === modal.action) {
                    set(state, ['modal'], {});
                    unset(state, ['txSigned']);
                }
            }
        );
        handleAsyncThunkStatus({
            asyncThunk: signInWithLedger,
            buildStatusPath: () => ['status'],
            builder
        });
    })
});

export default ledgerSlice;

export const actions = {
    signInWithLedger,
    checkAndHideLedgerModal,
    signInWithLedgerAddAndSaveAccounts,
    ...ledgerSlice.actions
};
export const reducer = ledgerSlice.reducer;

// Top level selectors
export const selectLedgerSlice = (state) => state[SLICE_NAME];

export const selectLedgerTxSigned = createSelector(selectLedgerSlice, (ledger) => ledger.txSigned);

export const selectLedgerModal = createSelector(selectLedgerSlice, (ledger) => ledger.modal || {});

export const selectLedgerModalShow = createSelector(selectLedgerModal, (modal) => modal.show || false);

export const selectLedgerHasLedger = createSelector(selectLedgerSlice, (ledger) => ledger.hasLedger);

export const selectLedgerSignInWithLedger = createSelector(selectLedgerSlice, (ledger) => ledger.signInWithLedger || {});

export const selectLedgerSignInWithLedgerStatus = createSelector(selectLedgerSlice, (ledger) => ledger.signInWithLedgerStatus);
