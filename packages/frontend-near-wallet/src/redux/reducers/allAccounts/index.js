import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

import { refreshAccountExternal } from '../../actions/account';
import { staking } from '../../actions/staking';

const initialState = {};

const allAccountsReducer = handleActions({
    [refreshAccountExternal]: (state, { error, meta: { accountId }, payload, ready }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                [accountId]: { 
                    accountId, 
                    ...payload
                }
            }),
    [staking.updateAccount]: (state, { ready, error, payload }) => 
        (error || !ready || !state[payload.accountId])
            ? state
            : ({
                ...state,
                [payload.accountId]: { 
                    ...state[payload.accountId],
                    balance: {
                        ...state[payload.accountId].balance,
                        account: payload
                    }
                }
            }),
    [staking.updateLockup]: (state, { ready, error, payload }) => 
        (error || !ready || !payload.mainAccountId)
            ? state
            : ({
                ...state,
                [payload.mainAccountId]: { 
                    ...state[payload.mainAccountId],
                    balance: {
                        ...state[payload.mainAccountId].balance,
                        lockupAccount: payload
                    }
                }
            }),
    [staking.getLockup]: (state, { ready, error, payload, meta }) => 
        (error || !ready || meta.isOwner)
            ? state
            : ({
                ...state,
                [meta.accountId]: { 
                    ...state[meta.accountId],
                    hasLockup: !!payload
                }
            })
}, initialState);


export default reduceReducers(
    allAccountsReducer
);
