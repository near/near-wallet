import { combineReducers } from 'redux';

import tokensMetadataSlice from '../slices/tokensMetadata';

export default {
    shared: combineReducers({
        [tokensMetadataSlice.name]: tokensMetadataSlice.reducer,
    })
};
