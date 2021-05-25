import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { likelyTokens } from '../../actions/likelyTokens'

const initialState = {
    likelyContracts: [],
    tokens: []
}

const tokens = handleActions({
    [likelyTokens.get]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                likelyContracts: payload
            }),
}, initialState)

export default reduceReducers(
    initialState,
    tokens
)
