import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import allAccounts from '../reducers/allAccounts'
import account from './account'
import sign from './sign'
import availableAccounts from './available-accounts'

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    sign,
    router: connectRouter(history)
})
