import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { Mixpanel } from "../../../mixpanel";
import { wallet } from "../../../utils/wallet";
import { multiplyGas } from "../../actions/account";
import { showCustomAlert } from "../../actions/status";
import { selectAccountId, selectAccountUrl } from "../account";

const SLICE_NAME = 'sign';

export const handleSignTransactionsMultiplyGas = createAsyncThunk(
    `${SLICE_NAME}/handleSignTransactionsMultiplyGas`,
    async (_, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        dispatch(multiplyGas(selectAccountUrl(getState())));
        await dispatch(handleSignTransactions());
    }
);

export const handleSignTransactions = createAsyncThunk(
    `${SLICE_NAME}/handleSignTransactions`,
    async (_, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        let transactionsHashes;

        await Mixpanel.withTracking("SIGN",
            async () => {
                const transactions = selectSignTransactions(getState());
                const accountId = selectAccountId(getState());

                try {
                    transactionsHashes = await wallet.signAndSendTransactions(transactions, accountId);
                } catch (error) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: `reduxActions.${error.code}`,
                        errorMessage: error.message
                    }));
                    throw error;
                }
            }
        );

        return transactionsHashes;
    },
    {
        condition: (_, thunkAPI) => {
            const { getState } = thunkAPI;
            if (selectSignStatus(getState()) === 'in-progress') {
                return false;
            }
        }
    }
);

export function addQueryParams(baseUrl, queryParams) {
    const url = new URL(baseUrl);
    for (let key in queryParams) {
        const param = queryParams[key];
        if(param) url.searchParams.set(key, param);
    }
    return url.toString();
}

// Top level selectors
export const selectSignSlice = (state) => state[SLICE_NAME];

export const selectSignTransactions = createSelector(
    [selectSignSlice],
    (sign) => sign.transactions || []
);

export const selectSignCallbackUrl = createSelector(
    [selectSignSlice],
    (sign) => sign.callbackUrl
);

export const selectSignMeta = createSelector(
    [selectSignSlice],
    (sign) => sign.meta
);

export const selectSignStatus = createSelector(
    [selectSignSlice],
    (sign) => sign.status
);
