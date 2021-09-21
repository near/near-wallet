import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';
import { createSelector } from 'reselect';

import { wallet } from '../../../utils/wallet';
import createParameterSelector from '../createParameterSelector';
import initialErrorState from '../initialErrorState';

const SLICE_NAME = 'recoveryMethods';

const initialState = {
    byAccountId: {}
};

const initialAccountIdState = {
    items: [],
    status: {
        loading: false,
        error: initialErrorState
    }
};

const fetchRecoveryMethods = createAsyncThunk(
    `${SLICE_NAME}/fetchRecoveryMethods`,
    async (_, thunkAPI) => {
        const { dispatch } = thunkAPI;

        const recoveryMethods = await wallet.getRecoveryMethods();

        const { actions: { setRecoveryMethods } } = recoveryMethodsSlice;
        await dispatch(setRecoveryMethods({ recoveryMethods }));
    },
    {
        condition: ({ accountId }, thunkAPI) => {
            const { getState } = thunkAPI;
            if (selectRecoveryMethodsLoading(getState(), { accountId })) {
                return false;
            }
        }
    }
);

const recoveryMethodsSlice = createSlice({
        name: SLICE_NAME,
        initialState,
        reducers: {
            setRecoveryMethods(state, { payload }) {
                const { recoveryMethods: { accountId, data } } = payload;
                set(state, ['byAccountId', accountId, 'items'], data);
            }
        },
        })
    }
);

export default recoveryMethodsSlice;
export const actions = {
    fetchRecoveryMethods,
    ...recoveryMethodsSlice.actions
};
