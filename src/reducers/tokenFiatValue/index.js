import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

import { getTokenFiatValue } from '../../actions/tokenFiatValue';

const initialState = { 
    tokens: {}
};

const tokenFiatValue = handleActions({
    [getTokenFiatValue]: (state, { payload }) => ({
        ...state,
        ...payload
    })
}, initialState);

export default reduceReducers(
    initialState,
    tokenFiatValue
);

export const allTokenFiatValues = (state) => state.tokenFiatValue;
export const selectNearTokenFiatValueUSD = createSelector(allTokenFiatValues, (tokens) => tokens.near?.usd);