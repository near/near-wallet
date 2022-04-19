<<<<<<< HEAD
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import merge from 'lodash.merge';
import { wallet } from "../../../utils/wallet";
import { createSelector } from "reselect";
import { ACCOUNT_ID_SUFFIX } from "../../../config"
=======
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import merge from 'lodash.merge';
import { createSelector } from 'reselect';

import { ACCOUNT_ID_SUFFIX } from '../../../config';
import { wallet } from '../../../utils/wallet';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';



<<<<<<< HEAD
const SLICE_NAME = "multiplier";
=======
const SLICE_NAME = 'multiplier';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const initialState = {
    ...initialStatusState,
    prices: {},
};

export const fetchMultiplier = createAsyncThunk(
    `${SLICE_NAME}/fetchMultiplier`,
    async function () {
        try {
            const response = await wallet.connection.provider.sendJsonRpc(
<<<<<<< HEAD
                "query",
                {
                    request_type: "call_function",
                    account_id: `priceoracle.${ACCOUNT_ID_SUFFIX}`,
                    method_name: "get_price_data",
                    args_base64: btoa(`{"asset_ids": ["wrap.${ACCOUNT_ID_SUFFIX}"]}`),
                    finality: "final",
=======
                'query',
                {
                    request_type: 'call_function',
                    account_id: `priceoracle.${ACCOUNT_ID_SUFFIX}`,
                    method_name: 'get_price_data',
                    args_base64: btoa(`{"asset_ids": ["wrap.${ACCOUNT_ID_SUFFIX}"]}`),
                    finality: 'final',
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                }
            );

            const res = JSON.parse(
<<<<<<< HEAD
                response.result.map((x) => String.fromCharCode(x)).join("")
=======
                response.result.map((x) => String.fromCharCode(x)).join('')
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
            );

            return res.prices[0].price;
        } catch (error) {
<<<<<<< HEAD
            console.warn(`Failed to load `, error);
=======
            console.warn('Failed to load ', error);
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        }
    }
);

const multiplierSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchMultiplier.fulfilled, (state, action) => {
            merge(state.prices, action.payload);
        });
    },
});

export default multiplierSlice;

export const reducer = multiplierSlice.reducer;

const selectmultiplierSlice = (state) => state[SLICE_NAME];

const selectMultiplier = createSelector(
    selectmultiplierSlice,
    ({ prices }) => prices || {}
);

export const selectMetadataSlice = createSelector(
    selectMultiplier,
    (prices) => prices.multiplier || {}
);
