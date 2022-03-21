import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import assign from 'lodash.assign';

import { 
    WALLET_INITIAL_DEPOSIT_URL,
    WALLET_LOGIN_URL,
    WALLET_SIGN_URL,
    WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS
} from '../../../utils/wallet';
import { getBalance } from '../../actions/account';

const SLICE_NAME = 'flowLimitation';

const initialState = {
    mainMenu: false,
    subMenu: false,
    accountPages: false,
    accountData: false,
    accountBalance: false
};

const handleFlowLimitation = createAsyncThunk(
    `${SLICE_NAME}/handleFlowLimitation`,
    async (_, thunkAPI) => {
        const { actions: { setFlowLimitation } } = flowLimitationSlice;
        const { dispatch, getState } = thunkAPI;
        const { pathname } = getState().router.location;

        // Disallow account switching on account creation/recovery pages
        const disableAccountSwitching = WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS.some((url) => pathname.includes(url));
        dispatch(setFlowLimitation({ subMenu: disableAccountSwitching }));

        const { redirect_url } = getState().account.url;
        const redirectUrl = redirect_url || pathname;

        if (redirectUrl.includes(WALLET_LOGIN_URL)) {
            dispatch(setFlowLimitation({
                mainMenu: true,
                subMenu: false,
                accountPages: false,
                accountData: true,
                accountBalance: true
            }));
        } 
        else if (redirectUrl === `/${WALLET_SIGN_URL}`) {
            dispatch(setFlowLimitation({
                mainMenu: true,
                subMenu: true,
                accountPages: true,
                accountData: true,
                accountBalance: false
            }));
        }
        else if (redirectUrl.includes(WALLET_INITIAL_DEPOSIT_URL)) {
            dispatch(setFlowLimitation({
                mainMenu: true,
                subMenu: true,
                accountPages: true,
                accountData: true,
                accountBalance: false
            }));
        }
    }
);

const handleClearflowLimitation = createAsyncThunk(
    `${SLICE_NAME}/handleClearflowLimitation`,
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const { actions: { clearFlowLimitation } } = flowLimitationSlice;

        dispatch(getBalance());
        dispatch(clearFlowLimitation());
    }
);

const flowLimitationSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setFlowLimitation(state, { payload }) {
            assign(state, payload);
        },
        clearFlowLimitation(state) {
            assign(state, initialState);
        }
    }
});

export default flowLimitationSlice;

export const actions = {
    handleFlowLimitation,
    handleClearflowLimitation,
    ...flowLimitationSlice.actions
};
export const reducer = flowLimitationSlice.reducer; 

// Top level selectors
const selectFlowLimitationSlice = (state) => state[SLICE_NAME];

export const selectFlowLimitationMainMenu = createSelector(
    selectFlowLimitationSlice,
    ({ mainMenu }) => mainMenu || false
);

export const selectFlowLimitationSubMenu = createSelector(
    selectFlowLimitationSlice,
    ({ subMenu }) => subMenu || false
);

export const selectFlowLimitationMAccountPages = createSelector(
    selectFlowLimitationSlice,
    ({ accountPages }) => accountPages || false
);

export const selectFlowLimitationAccountData = createSelector(
    selectFlowLimitationSlice,
    ({ accountData }) => accountData || false
);

export const selectFlowLimitationAccountBalance = createSelector(
    selectFlowLimitationSlice,
    ({ accountBalance }) => accountBalance || false
);
