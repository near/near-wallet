import BN from 'bn.js';
import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { clearAccountState } from '../../actions/account';
import { tokens } from '../../actions/tokens';

const initialState = {
    tokens: {}
};

const tokensReducer = handleActions({
    [tokens.tokensDetails.getMetadata]: (state, { ready, error, payload }) =>
        (!ready || error || !payload.metadata)
            ? state
            : ({
                ...state,
                tokens: {
                    ...state.tokens,
                    [payload.contractName]: {
                        contractName: payload.contractName,
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
                        contractName: payload.contractName,
                        balance: payload.balance
                    }
                }
            }),
}, initialState);

const clearReducer = handleActions({
    [clearAccountState]: () => initialState
}, initialState);

export default reduceReducers(
    initialState,
    tokensReducer,
    clearReducer
);

const selectTokens = (state) => state.tokens.tokens;
export const selectTokensDetails = createSelector(
  selectTokens,
  (tokens) => Object.keys(tokens)
  .map(key => tokens[key])
  .filter(token => !new BN(token.balance).isZero())
  .sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''))
);