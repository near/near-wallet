import { combineReducers } from 'redux';

import tokensSlice from './slices/tokens';

export default () => combineReducers({
    [tokensSlice.name]: tokensSlice.reducer
});
