import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { refreshAccountExternal, updateStakingAccount, updateStakingLockup } from '../actions/account'
import { staking } from '../actions/staking'

const initialState = {}

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
        (!ready || error)
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
        (!ready || error)
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
}, initialState)


export default reduceReducers(
    allAccountsReducer
)
