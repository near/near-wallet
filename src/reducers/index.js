import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import account from './account'

export default (history) => combineReducers({
   localize: localizeReducer,
   account,
   router: connectRouter(history)
})
