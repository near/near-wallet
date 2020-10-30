import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux';

import allAccounts from '../reducers/allAccounts'
import availableAccounts from './available-accounts'
import account from './account'
import transactions from './transactions'
import sign from './sign'
import recoveryMethods from '../reducers/recoveryMethods'
import ledger from './ledger'
import staking from './staking'

export default (history) => combineReducers({
    localize: localizeReducer,
    allAccounts,
    availableAccounts,
    account,
    transactions,
    sign,
    recoveryMethods,
    ledger,
    staking,
    router: connectRouter(history)
})
