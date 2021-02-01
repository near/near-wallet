import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { refreshAccountExternal, updateStakingAccount, updateStakingLockup } from '../actions/account'

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
    [updateStakingAccount]: (state, { error, meta, payload, ready }) => 
        (!ready || error || !meta.accountId)
            ? state
            : ({
                ...state,
                [meta.accountId]: { 
                    ...state[meta.accountId],
                    balance: {
                        ...state[meta.accountId].balance,
                        account: payload
                    }
                }
            }),
    [updateStakingLockup]: (state, { error, meta, payload, ready }) => 
        (!ready || error || !meta.accountId)
            ? state
            : ({
                ...state,
                [meta.accountId]: { 
                    ...state[meta.accountId],
                    balance: {
                        ...state[meta.accountId].balance,
                        lockupAccount: payload
                    }
                }
            })
}, initialState)


export default reduceReducers(
    allAccountsReducer
)
