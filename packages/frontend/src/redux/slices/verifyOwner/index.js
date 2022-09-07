import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

import { wallet } from '../../../utils/wallet';
import { showCustomAlert } from '../../actions/status';
import { selectAccountId } from '../account';

const SLICE_NAME = 'verifyOwner';

export const verifyOwnerSlice = (state) => state[SLICE_NAME];

export const VERIFY_OWNER_STATUS = {
    IN_PROGRESS: 'verify-owner-in-progress',
    NEEDS_CONFIRMATION: 'verify-owner-needs-confirmation',
    COMPLETED: 'verify-owner-completed',
};

export const selectVerifyOwnerStatus = createSelector(
    [verifyOwnerSlice],
    (verifyOwner) => verifyOwner.status
);

export const selectSignedRequest = createSelector(
    [verifyOwnerSlice],
    (verifyOwner) => verifyOwner.signedRequest || {}
);

export const selectVerifyOwnerError = createSelector(
    [verifyOwnerSlice],
    (verifyOwner) => verifyOwner.error
);

export const handleAuthorizationRequestRejected = createAction('handleAuthorizationRequestRejected');

export const handleAuthorizationRequestConfirmed = createAsyncThunk(
    `${SLICE_NAME}/handleAuthorizationRequestConfirmed`,
    async (message, thunkAPI) => {
        const { dispatch, getState } = thunkAPI;
        try {
            const accountId = selectAccountId(getState());
            const blockInfo = await wallet.connection.provider.block({ finality: 'final' });
            const publicKey = await wallet.getPublicKey(accountId);
            const data = {
                accountId,
                message,
                blockId: blockInfo.header.hash,
                publicKey: Buffer.from(publicKey.data).toString('base64'),
                keyType: publicKey.keyType
            };

            const encoded = JSON.stringify(data);
            const signed = await wallet.signMessage(encoded, accountId);

            return {
                ...data,
                signature: Buffer.from(signed.signed.signature).toString('base64'),
                keyType: signed.signed.publicKey.keyType
            };
        } catch (error) {
            dispatch(
                showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    messageCode: `reduxActions.${error.code}`,
                    errorMessage: error.message,
                })
            );
            throw error;
        }
    },
    {
        condition: (_, thunkAPI) => {
            const { getState } = thunkAPI;
            if (
                selectVerifyOwnerStatus(getState()) ===
                VERIFY_OWNER_STATUS.IN_PROGRESS
            ) {
                return false;
            }
        },
    }
);
