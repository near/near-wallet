import { createAsyncThunk } from "@reduxjs/toolkit";
import BN from 'bn.js';
import cloneDeep from 'lodash.clonedeep';
import { createSelector } from "reselect";

import { Mixpanel } from "../../../mixpanel";
import { wallet } from "../../../utils/wallet";
import { showCustomAlert } from "../../actions/status";
import { selectAccountId } from "../account";

const SLICE_NAME = 'sign';

export const SIGN_STATUS = {
    IN_PROGRESS: 'in-progress',
    NEEDS_CONFIRMATION: 'needs-confirmation',
    RETRY_TRANSACTION: 'retry-tx',
    SUCCESS: 'success',
    ERROR: 'error'
};

export const RETRY_TX_GAS = {
    DIFF: '100000000000',
    MAX: '300000000000000'
};

export const handleSignTransactions = createAsyncThunk(
    `${SLICE_NAME}/handleSignTransactions`,
    async (_, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        let transactionsHashes;
        const status = selectSignStatus(getState());

        const mixpanelName = `SIGN${status === SIGN_STATUS.RETRY_TRANSACTION ? ` - RETRYRETRY WITH INCREASED GAS` : ''}`;
        await Mixpanel.withTracking(mixpanelName,
            async () => {
                const transactions = selectSignTransactions(getState());
                const accountId = selectAccountId(getState());

                try {
                    transactionsHashes = await wallet.signAndSendTransactions(transactions, accountId);
                } catch (error) {
                    if (error.message.includes('TotalPrepaidGasExceeded')) {
                        Mixpanel.track('SIGN - too much gas detected');
                    }

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
            if (selectSignStatus(getState()) === SIGN_STATUS.IN_PROGRESS) {
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

export const increaseGasForTransactions = ({ transactions }) => {
    transactions.forEach((t) => {
        const oneFunctionCallAction = t.actions && t.actions.filter((a) => !!a.functionCall).length === 1;

        t.actions && t.actions.forEach((a) => {
            if (!(a.functionCall && a.functionCall.gas)) { 
                return false;
            }

            if (oneFunctionCallAction) {
                // If we only have a single functionCall type action, it is probably safe to immediately try RETRY_TX_GAS.MAX for that one action
                a.functionCall.gas = new BN(RETRY_TX_GAS.MAX);
                return;
            }

            // If there are more than one functionCall type actions, we will try to incrementally increase
            // gas allocated -- we don't increase straight to RETRY_TX_GAS.MAX because it is highly likely that we will
            // attach too much gas and encounter a `TotalPrepaidGasExceeded` type of error
            a.functionCall.gas = BN.min(
                new BN(RETRY_TX_GAS.MAX),
                a.functionCall.gas.add(new BN(RETRY_TX_GAS.DIFF))
            );
        });
    });
    return transactions;
};

export const calculateGasLimit = (actions) => actions
    .filter(a => Object.keys(a)[0] === 'functionCall')
    .map(a => a.functionCall.gas)
    .reduce((totalGas, gas) => totalGas.add(gas), new BN(0)).toString();

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

export const selectSignFeesGasLimitIncludingGasChanges = createSelector(
    [selectSignTransactions],
    (transactions) => {
        const tx = increaseGasForTransactions({ transactions: cloneDeep(transactions)});
        return calculateGasLimit(tx.flatMap(t => t.actions));
    }
);
