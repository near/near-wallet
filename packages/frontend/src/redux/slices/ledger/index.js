import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import set from 'lodash.set';
import unset from 'lodash.unset';
import { createSelector } from 'reselect';

import { HIDE_SIGN_IN_WITH_LEDGER_ENTER_ACCOUNT_ID_MODAL } from '../../../config';
import { showAlertToolkit } from '../../../utils/alerts';
import { ledgerManager } from '../../../utils/ledgerManager';
import { setLedgerHdPath } from '../../../utils/localStorage';
import { wallet } from '../../../utils/wallet';
import { showCustomAlert } from '../../actions/status';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import refreshAccountOwner from '../../sharedThunks/refreshAccountOwner';

const SLICE_NAME = 'ledger';

export const LEDGER_MODAL_STATUS = {
    CONFIRM_PUBLIC_KEY: 'confirm-public-key',
    CONFIRM_ACCOUNTS: 'confirm-accounts',
    ENTER_ACCOUNTID: 'enter-accountId',
    SUCCESS: 'success'
};

export const CONNECT_MODAL_TYPE = {
    CONNECT: 'connect',
    CONNECTION_ERROR: 'connection-error',
    DISCONNECTED: 'disconnected'
};

const initialState = {
    ...initialStatusState,
    modal: {},
    connection: {
        available: false,
        disconnected: false,
        modal: {},
        ...initialStatusState
    }
};

const handleShowConnectModal = createAsyncThunk(
    `${SLICE_NAME}/handleConnectLedger`,
    async (_, { dispatch }) => {
        dispatch(ledgerSlice.actions.setLedgerConnectionModalType({ type: CONNECT_MODAL_TYPE.CONNECT }));
    }
);

const handleConnectLedger = createAsyncThunk(
    `${SLICE_NAME}/handleConnectLedger`,
    async (_, { dispatch }) => {
        try {
            await ledgerManager.initialize(() => dispatch(handleDisconnectLedger()));
            const { available } = ledgerManager;
            dispatch(ledgerSlice.actions.setLedgerConnectionStatus({ available }));
            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: 'connectLedger.ledgerConnected',
                messageCode: 'connectLedger.youMayNow',
            }));
            dispatch(ledgerSlice.actions.setLedgerConnectionModalType({ type: undefined }));
        } catch (error) {
            dispatch(ledgerSlice.actions.setLedgerConnectionModalType({ type: CONNECT_MODAL_TYPE.CONNECTION_ERROR }));
            throw error;
        }
    },
    showAlertToolkit({ onlyError: true })
);

const handleDisconnectLedger = createAsyncThunk(
    `${SLICE_NAME}/handleDisconnectLedger`,
    async (_, { dispatch }) => {
        dispatch(ledgerSlice.actions.setLedgerConnectionStatus({ available: false }));
        dispatch(ledgerSlice.actions.setLedgerDisconnect({ disconnected: true }));
        dispatch(ledgerSlice.actions.setLedgerConnectionModalType({ type: CONNECT_MODAL_TYPE.DISCONNECTED }));

        dispatch(showCustomAlert({
            success: false,
            messageCodeHeader: 'warning',
            messageCode: 'errors.ledger.disconnected',
        }));
    }
);

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
                await dispatch(addLedgerAccountId({ accountId })).unwrap();
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
        setLedgerConnectionStatus(state, { payload: { available } }) {
            set(state, ['connection', 'available'], available);
        },
        setLedgerDisconnect(state, { payload: { disconnected } }) {
            set(state, ['connection', 'disconnected'], disconnected);
        },
        setLedgerConnectionModalType(state, { payload: { type } }) {
            set(state, ['connection', 'modal', 'type'], type);
        }
    },
    extraReducers: ((builder) => {
        // getLedgerAccountIds
        builder.addCase(getLedgerAccountIds.pending, (state) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_PUBLIC_KEY);
        });
        builder.addCase(getLedgerAccountIds.fulfilled, (state, { payload }) => {
            unset(state, ['txSigned']);
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.CONFIRM_ACCOUNTS);
            payload.forEach((accountId) => 
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
        builder.addCase(handleConnectLedger.rejected, (state) => {
            set(state, ['connection', 'available'], false);
        });
        // signInWithLedger
        builder.addCase(signInWithLedger.fulfilled, (state) => {
            set(state, ['signInWithLedgerStatus'], LEDGER_MODAL_STATUS.SUCCESS);
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
            buildStatusPath: () => [],
            builder
        });
        handleAsyncThunkStatus({
            asyncThunk: handleConnectLedger,
            buildStatusPath: () => ['connection'],
            builder
        });
    })
});

export default ledgerSlice;

export const actions = {
    handleShowConnectModal,
    handleConnectLedger,
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

const selectLedgerConnection = createSelector(selectLedgerSlice, (ledger) => ledger.connection);

export const selectLedgerConnectionAvailable= createSelector(selectLedgerConnection, (connection) => connection.available);

export const selectLedgerConnectionModalType = createSelector(selectLedgerConnection, (connection) => connection.modal.type);

export const selectLedgerConnectionStatus = createSelector(selectLedgerConnection, (connection) => connection.status);

export const selectLedgerConnectionStatusLoading = createSelector(selectLedgerConnectionStatus, (status) => status.loading);

export const selectLedgerConnectionStatusError = createSelector(selectLedgerConnectionStatus, (status) => status.error);
