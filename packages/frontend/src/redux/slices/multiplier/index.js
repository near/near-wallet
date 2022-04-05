import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { wallet } from "../../../utils/wallet";
import { createSelector } from "reselect";
import { ACCOUNT_ID_SUFFIX } from "../../../config"



const SLICE_NAME = "multiplier";

const initialState = {
    prices: {},
};

export const fetchMultiplier = createAsyncThunk(
    `${SLICE_NAME}/fetchMultiplier`,
    async function () {
        try {
            const response = await wallet.connection.provider.sendJsonRpc(
                "query",
                {
                    request_type: "call_function",
                    account_id: `priceoracle.${ACCOUNT_ID_SUFFIX}`,
                    method_name: "get_price_data",
                    args_base64: "eyJhc3NldF9pZHMiOiBbIndyYXAudGVzdG5ldCJdfQ==",
                    finality: "final",
                }
            );

            const res = JSON.parse(
                response.result.map((x) => String.fromCharCode(x)).join("")
            );

            return res.prices[0].price;
        } catch (error) {
            console.warn(`Failed to load `, error);
        }
    }
);

const multiplierSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    extraReducers: {
        [fetchMultiplier.fulfilled]: (state, action) => {
            state.prices = action.payload;
        },
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
