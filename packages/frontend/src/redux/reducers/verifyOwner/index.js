import { handleActions } from 'redux-actions';

import {
    VERIFY_OWNER_STATUS,
    handleAuthorizationRequestConfirmed,
    handleAuthorizationRequestRejected,
} from '../../slices/verifyOwner';

const initialState = {
    status: VERIFY_OWNER_STATUS.NEEDS_CONFIRMATION,
    signedRequest: {},
};

export default handleActions(
    {
        [handleAuthorizationRequestRejected]: (state) => ({
            ...state,
            signedRequest: undefined,
            status: VERIFY_OWNER_STATUS.COMPLETED,
            error: new Error('User rejected')
        }),
        [handleAuthorizationRequestConfirmed.pending]: (state) => ({
            ...state,
            status: VERIFY_OWNER_STATUS.IN_PROGRESS,
            error: undefined,
        }),
        [handleAuthorizationRequestConfirmed.rejected]: (state, { error }) => ({
            ...state,
            status: VERIFY_OWNER_STATUS.NEEDS_CONFIRMATION,
            error
        }),
        [handleAuthorizationRequestConfirmed.fulfilled]: (state, { payload }) => ({
            ...state,
            signedRequest: payload,
            status: VERIFY_OWNER_STATUS.COMPLETED,
            error: undefined
        })
    },
    initialState
);
