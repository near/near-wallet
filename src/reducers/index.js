import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import account from './account'
import sign from './sign'

export default (history) => combineReducers({
   localize: localizeReducer,
   account,
   sign,
   router: connectRouter(history)
})
