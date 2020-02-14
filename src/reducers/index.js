import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import account from './account'
import sign from './sign'
import availableAccounts from './available-accounts'

export default (history) => combineReducers({
   localize: localizeReducer,
   account,
   availableAccounts,
   sign,
   router: connectRouter(history)
})
