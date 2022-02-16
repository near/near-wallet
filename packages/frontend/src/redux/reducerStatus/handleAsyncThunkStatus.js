import { isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import clearError from './manageStatus/clearError';
import clearLoading from './manageStatus/clearLoading';
import setError from './manageStatus/setError';
import setLoading from './manageStatus/setLoading';

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
    .addMatcher(isPending(asyncThunk), setLoading(buildStatusPath))
    .addMatcher(isPending(asyncThunk), clearError(buildStatusPath))
    .addMatcher(isFulfilled(asyncThunk), clearLoading(buildStatusPath))
    .addMatcher(isFulfilled(asyncThunk), clearError(buildStatusPath))
    .addMatcher(isRejected(asyncThunk), clearLoading(buildStatusPath))
    .addMatcher(isRejected(asyncThunk), setError(buildStatusPath));
