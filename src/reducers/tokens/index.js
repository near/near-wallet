import { handleActions } from 'redux-actions'
import reduceReducers from 'reduce-reducers'

import { tokens } from '../../actions/tokens'

const initialState = {
    likelyContracts: [],
    tokens: {}
}

const likelyContractsReducer = handleActions({
    [tokens.likelyContracts.get]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                likelyContracts: payload
            }),
}, initialState)

const tokensReducer = handleActions({
    [tokens.likelyContracts.get]: (state, { ready, error, payload, meta }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: [...payload, ...meta].reduce((x, contract) => ({
                    ...x,
                    [contract]: { 
                        contract 
                    }
                }), {})
            }),
    [tokens.tokensDetails.getMetadata]: (state, { ready, error, payload, meta }) =>
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
    [tokens.tokensDetails.getBalanceOf]: (state, { ready, error, payload, meta }) => 
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
    [tokens.clearState]: (state, { payload }) => ({
        ...initialState
    }),
}, initialState)

export default reduceReducers(
    initialState,
    likelyContractsReducer,
    tokensReducer,
    clearReducer
)
