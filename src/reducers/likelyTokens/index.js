import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { likelyTokens, tokens } from '../../actions/likelyTokens'

const initialState = {
    likelyContracts: [],
    tokens: []
}


const likelyTokensReducer = handleActions({
    [likelyTokens.get]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                likelyContracts: payload
            }),
}, initialState)

const tokensReducer = handleActions({
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
    likelyTokensReducer,
    tokensReducer
)
