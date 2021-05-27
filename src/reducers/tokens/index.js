import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { likelyContracts, tokens, clear } from '../../actions/tokens'

const initialState = {
    likelyContracts: [],
    tokens: {}
}

const likelyContractsReducer = handleActions({
    [likelyContracts.get]: (state, { ready, error, payload }) =>
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
    [tokens.getMetadata]: (state, { ready, error, payload, meta }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: {
                    ...state.tokens,
                    [payload.contract]: {
                        ...state.tokens[payload.contract],
                        ...payload.metadata
                    }
                }
            }),
    [tokens.getBalanceOf]: (state, { ready, error, payload, meta }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: {
                    ...state.tokens,
                    [payload.contract]: {
                        ...state.tokens[payload.contract],
                        balance: payload.balance
                    }
                }
            }),
}, initialState)

const clearReducer = handleActions({
    [clear]: (state, { payload }) => ({
        ...initialState
    }),
}, initialState)

export default reduceReducers(
    initialState,
    likelyContractsReducer,
    tokensReducer,
    clearReducer
)
