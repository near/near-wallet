import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import allAccounts from '../reducers/allAccounts'
import availableAccounts from './available-accounts'
import account from './account'
import sign from './sign'
import recoveryMethods from '../reducers/recoveryMethods'

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    sign,
    recoveryMethods,
    router: connectRouter(history)
})
