import { handleActions, combineActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { refreshAccountExternal } from '../actions/account'

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
    }
}, initialState)


export default reduceReducers(
    allAccountsReducer
)


