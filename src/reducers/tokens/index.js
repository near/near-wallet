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
    [tokens.likelyContracts.get]: (state, { ready, error, payload, meta: whitelistedContractNames }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: [...payload, ...whitelistedContractNames].reduce((x, contractName) => ({
                    ...x,
                    [contractName]: { 
                        contractName: contractName
                    }
                }), {})
            }),
    [tokens.tokensDetails.getMetadata]: (state, { ready, error, payload }) =>
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: {
                    ...state.tokens,
                    [payload.contractName]: {
                        ...state.tokens[payload.contractName],
                        ...payload.metadata
                    }
                }
            }),
    [tokens.tokensDetails.getBalanceOf]: (state, { ready, error, payload }) => 
        (!ready || error)
            ? state
            : ({
                ...state,
                tokens: {
                    ...state.tokens,
                    [payload.contractName]: {
                        ...state.tokens[payload.contractName],
                        balance: payload.balance
                    }
                }
            }),
}, initialState)

const clearReducer = handleActions({
    [tokens.clearState]: () => ({
        ...initialState
    }),
}, initialState)

export default reduceReducers(
    initialState,
    likelyContractsReducer,
    tokensReducer,
    clearReducer
)

export const selectTokensDetails = state => state.tokens.tokens
