import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import account from './account'

export default (history) => combineReducers({
   account,
   router: connectRouter(history)
})
