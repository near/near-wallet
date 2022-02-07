import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import BN from 'bn.js';
import cloneDeep from 'lodash.clonedeep';
import { parse, stringify } from "query-string";
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

export const updateSuccessHashes = createAction('updateSuccessHashes');

export const handleSignTransactions = createAsyncThunk(
    `${SLICE_NAME}/handleSignTransactions`,
    async (_, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        let transactionsHashes;
        const retryingTx = !!selectSignRetryTransactions(getState()).length;

        const mixpanelName = `SIGN${retryingTx ? ` - RETRYRETRY WITH INCREASED GAS` : ''}`;
        await Mixpanel.withTracking(mixpanelName,
            async () => {
                let transactions;
                if (retryingTx) {
                    transactions = selectSignRetryTransactions(getState());
                } else {
                    transactions = selectSignTransactions(getState());
                }
                
                const accountId = selectAccountId(getState());

                try {
                    transactionsHashes = await wallet.signAndSendTransactions(transactions, accountId);
                    dispatch(updateSuccessHashes(transactionsHashes));
                } catch (error) {
                    if (error.message.includes('TotalPrepaidGasExceeded')) {
                        Mixpanel.track('SIGN - too much gas detected');
                    }
                    
                    if (error.message.includes('Exceeded the prepaid gas')) {
                        const successHashes = error?.data?.transactionHashes;
                        dispatch(updateSuccessHashes(successHashes));
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
        return selectSignSuccessHashesOnlyHash(getState());
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

export function addQueryParams(baseUrl, queryParams = {}) {
    const url = new URL(baseUrl);
    const originalSearchParams = parse(url.search);
    return `${url.origin}?${stringify({...originalSearchParams, ...queryParams}, {
        skipEmptyString: true,
        skipNull: true,
    })}`;
}

export const removeSuccessTransactions = ({ transactions, successHashes }) => {
    const transactionsCopy = cloneDeep(transactions);

    successHashes.map(({ nonceString }) => {
        if (transactionsCopy[0].nonce.toString() === nonceString) {
            transactionsCopy.shift();
        }
    });

    return transactionsCopy;
};

export const calculateGasForSuccessTransactions = ({ transactions, successHashes }) => {
    const successHashesNonce = successHashes.map((successHash) => successHash.nonceString);
    let gasUsed = new BN('0');

    for (let { nonce, actions } of transactions) {
        if (successHashesNonce.includes(nonce.toString())) {
            gasUsed = gasUsed.add(new BN(calculateGasLimit(actions)));
        }
    }

    return gasUsed.toString();
};

export const checkAbleToIncreaseGas = ({ transaction }) => {
    if (!transaction.actions) { return false; }

    return transaction.actions.some((a) => {
        // We can only increase gas for actions that are function calls and still have < RETRY_TX.GAS.MAX gas allocated
        if (!a || !a.functionCall) { return false; }

        return a.functionCall.gas.lt(new BN(RETRY_TX_GAS.MAX));
    });
};

// we want to take first transactions with functionCall action included because functionCall is the only action that can cause insuficient gas error
export const getFirstTransactionWithFunctionCallAction = ({ transactions }) => {
    return transactions.find((t) => {
        if (!t.actions) { return false; }

        return t.actions.some((a) => a && a.functionCall);
    });
};

export const increaseGasForFirstTransaction = ({ transactions }) => {
    const transaction = getFirstTransactionWithFunctionCallAction({ transactions });

    if (!transaction) {
        return transactions;
    }

    const oneFunctionCallAction = transaction.actions.filter((a) => !!a.functionCall).length === 1;

    // If there are multiple tx, we want to increase the gas, only for the first one, because it's possible that increasing gas for the other transactions will end with exceeded gas
    transaction.actions.forEach((a) => {
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

export const selectSignTransactionAmount = createSelector(
    [selectSignSlice],
    (sign) => sign.totalAmount
);

export const selectSignSuccessHashes = createSelector(
    [selectSignSlice],
    (sign) => sign.successHashes || []
);

export const selectSignTransactionHashes = createSelector(
    [selectSignSlice],
    (sign) => sign.transactionHashes || []
);

export const selectSignSuccessHashesOnlyHash = createSelector(
    [selectSignSuccessHashes],
    (successHashes) => successHashes.map((successHash) => successHash.hash) || []
);

export const selectSignRetryTransactions = createSelector(
    [selectSignSlice],
    (sign) => sign.retryTransactions || []
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

export const selectSignGasUsed = createSelector(
    [selectSignSlice],
    (sign) => sign.gasUsed || new BN('0')
);

export const selectSignFeesGasLimitIncludingGasChanges = createSelector(
    [selectSignTransactions, selectSignRetryTransactions, selectSignGasUsed],
    (transactions, retryTransactions, gasUsed) => {
        const transactionsToCalculate = !!retryTransactions.length
            ? retryTransactions
            : transactions;
        
        const tx = increaseGasForFirstTransaction({ transactions: cloneDeep(transactionsToCalculate)});
        return new BN(calculateGasLimit(tx.flatMap(t => t.actions))).add(gasUsed);
    }
);
