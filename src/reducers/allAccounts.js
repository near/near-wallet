import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { refreshAccountExternal, updateStakingAccount, updateStakingLockup } from '../actions/account'

const initialState = {}

const allAccountsReducer = handleActions({
    [refreshAccountExternal]: (state, { error, meta: { accountId }, payload, ready }) => {
        if (!ready) return state

        if (error) {
            return state
        }

        return {
            ...state,
            [accountId]: { 
                accountId, 
                ...payload
            }
        }
    },
    [updateStakingAccount]: (state, { error, meta, payload, ready }) => {
        if (!ready || error) {
            return state
        }

        return {
            ...state,
            [meta.accountId]: { 
                ...state[meta.accountId],
                balance: {
                    ...state[meta.accountId].balance,
                    account: payload
                }
            }
        }
    },
}, initialState)


export default reduceReducers(
    allAccountsReducer
)


