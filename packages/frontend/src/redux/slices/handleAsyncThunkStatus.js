import { isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import set from 'lodash.set';

import initialErrorState from './initialErrorState';

const fullPath = (action, buildStatusPath) => [...buildStatusPath(action), 'status'];

const setLoading = (buildStatusPath, loading) => (state, action) => set(state, [...fullPath(action, buildStatusPath), 'loading'], loading);

const clearError = (buildStatusPath) => (state, action) =>  set(state, [...fullPath(action, buildStatusPath), 'error'], initialErrorState);

const setError = (buildStatusPath) => (state, action) =>  set(state, [...fullPath(action, buildStatusPath), 'error'], {
    message: action.error?.message || 'An error was encountered.',
    code: action.error?.code
});

/**
 * Automatically handle status part of reducer based on initialErrorState
 *
 * @param asyncThunk actionCreator that is used to get the action type for matcher purpose
 * @param buildStatusPath array of strings representing the path to status state, needed because in a few cases we want to place the status object in more than one place
 * @param builder objct provides addCase, addMatcher, addDefaultCase functions
 */

// TODO: consider to keying `status` by thunk typePrefix, this could be useful if we would need to track status of several thunks independently in one slice
export default ({
    asyncThunk,
    buildStatusPath,
    builder
}) => builder
    .addMatcher(isPending(asyncThunk), setLoading(buildStatusPath, true))
    .addMatcher(isPending(asyncThunk), clearError(buildStatusPath))
    .addMatcher(isFulfilled(asyncThunk), setLoading(buildStatusPath, false))
    .addMatcher(isFulfilled(asyncThunk), clearError(buildStatusPath))
    .addMatcher(isRejected(asyncThunk), setLoading(buildStatusPath, false))
    .addMatcher(isRejected(asyncThunk), setError(buildStatusPath));
