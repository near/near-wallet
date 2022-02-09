import set from 'lodash.set';

import initialErrorState from './initialErrorState';

/**
 * Automatically handle status part of reducer based on initialErrorState
 *
 * @param asyncThunk actionCreator that is used to get the action type for matcher purpose
 * @param buildStatusPath array of strings representing the path to status state, needed because in a few cases we want to place the status object in more than one place
 * @param builder objct provides addCase, addMatcher, addDefaultCase functions
 */
export default ({
    asyncThunk,
    buildStatusPath,
    builder
}) => builder
    // TODO: use the same status object to all reducers, which will allow simplifying buildStatusPath 
    .addMatcher(
        (action) => action.type === `${asyncThunk.typePrefix}/pending`,
        (state, action) => {
            set(state, [...buildStatusPath(action), 'loading'], true);
            set(state, [...buildStatusPath(action), 'error'], initialErrorState);
        }
    )
    .addMatcher(
        (action) => action.type === `${asyncThunk.typePrefix}/fulfilled`,
        (state, action) => {
            set(state, [...buildStatusPath(action), 'loading'], false);
            set(state, [...buildStatusPath(action), 'error'], initialErrorState);
        }
    )
    .addMatcher(
        (action) => action.type === `${asyncThunk.typePrefix}/rejected`,
        (state, action) => {
            set(state, [...buildStatusPath(action), 'loading'], false);
            set(state, [...buildStatusPath(action), 'error'], {
                message: action.error?.message || 'An error was encountered.',
                code: action.error?.code
            });
        }
    );
