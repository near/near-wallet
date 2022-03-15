import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

import {
    getAccessKeys,
    clearCode,
    promptTwoFactor,
    refreshUrl,
    checkCanEnableTwoFactor,
    get2faMethod,
    getLedgerKey,
    getBalance,
    makeAccountActive,
    setLocalStorage,
    getAccountBalance,
    setAccountBalance,
    getMultisigRequest,
} from '../../actions/account';
import {
    staking
} from '../../actions/staking';
import refreshAccountOwner from '../../sharedThunks/refreshAccountOwner';

const initialState = {
    formLoader: false,
    sentMessage: false,
    requestPending: null,
    actionsPending: [],
    canEnableTwoFactor: null,
    twoFactor: null,
    ledgerKey: null,
    accountsBalance: undefined,
    multisigRequest: null,
};

const recoverCodeReducer = handleActions({
    [clearCode]: (state, { error, ready }) => {
        return { ...state, sentMessage: false };
    }
}, initialState);

const accessKeys = handleActions({
    [getAccessKeys]: (state, { error, payload }) => ({
        ...state,
        authorizedApps: payload && payload.filter((it) => it.access_key && it.access_key.permission.FunctionCall && it.access_key.permission.FunctionCall.receiver_id !== state.accountId),
        fullAccessKeys: payload && payload.filter((it) => it.access_key && it.access_key.permission === 'FullAccess'),
    })
}, initialState);

const url = handleActions({
    [refreshUrl]: (state, { payload }) => ({
        ...state,
        url: payload
    })
}, initialState);

const canEnableTwoFactor = handleActions({
    [checkCanEnableTwoFactor]: (state, { payload }) => ({
        ...state,
        canEnableTwoFactor: payload
    })
}, initialState);

const twoFactor = handleActions({
    [get2faMethod]: (state, { payload }) => ({
        ...state,
        twoFactor: payload
    })
}, initialState);

const multisigRequest = handleActions({
    [getMultisigRequest]: (state, { payload }) => ({
        ...state,
        multisigRequest: payload,
    })
}, initialState);

const twoFactorPrompt = handleActions({
    [promptTwoFactor]: (state, { payload }) => ({
        ...state,
        requestPending: payload.requestPending
    })
}, initialState);

const ledgerKey = handleActions({
    [getLedgerKey]: (state, { payload }) => ({
        ...state,
        ledgerKey: payload
    })
}, initialState);

const account = handleActions({
    [refreshAccountOwner.fulfilled]: (state, { payload }) => {
        const resetAccountState = {
            globalAlertPreventClear: payload && payload.globalAlertPreventClear,
            resetAccount: (state.resetAccount && state.resetAccount.preventClear) 
                ? {
                    ...state.resetAccount,
                    preventClear: false
                }
                : payload && payload.resetAccount
        };

        return {
            ...state,
            ...payload,
            balance: {
                ...payload?.balance,
                ...state.balance
            },
            ledger: undefined,
            ...resetAccountState,
            loader: false
        };
    },
    [staking.updateAccount]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    account: payload
                }
            }),
    [staking.updateLockup]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    lockupAccount: payload
                }
            }),
    [getBalance]: (state, { error, payload, ready }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                balance: {
                    ...state.balance,
                    ...payload
                }
            }),
    [makeAccountActive]: () => {
        return initialState;
    },
    [setLocalStorage]: (state, { payload }) => ({
        ...state,
        localStorage: {
            accountFound: !!payload,
            accountId: payload
        }
    }),
    [getAccountBalance]: (state, { error, payload, ready, meta }) =>
        (!ready || error)
            ? {
                ...state,
                accountsBalance: {
                    ...state.accountsBalance,
                    [meta.accountId]: {
                        loading: true
                    }
                }
            }
            : {
                ...state,
                accountsBalance: {
                    ...state.accountsBalance,
                    [meta.accountId]: {
                        ...payload,
                        loading: false
                    }
                }
            },
    [setAccountBalance]: (state, { payload }) => ({
        ...state,
        accountsBalance: {
            ...state.accountsBalance,
            [payload]: {
                loading: true
            }
        }
    }),
    [staking.getLockup]: (state, { error, payload, ready, meta }) => {
        if (!ready || error || !meta.isOwner) {
            return state;
        }

        return {
            ...state,
            hasLockup: !!payload
        };
    }
}, initialState);

export default reduceReducers(
    initialState,
    recoverCodeReducer,
    accessKeys,
    account,
    url,
    canEnableTwoFactor,
    twoFactor,
    twoFactorPrompt,
    ledgerKey,
    multisigRequest,
);
