import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { likelyTokens } from '../../actions/likelyTokens'

const initialState = {
    likelyContracts: [],
    tokens: []
}


const tokensReducer = handleActions({
    [likelyTokens.get]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                likelyContracts: payload
            }),
    [tokens.set]: (state, { payload }) => ({
        ...state,
        tokens: {
            ...state.tokens,
            ...payload
        }
    }),
}, initialState)

export default reduceReducers(
    initialState,
    tokensReducer
)
