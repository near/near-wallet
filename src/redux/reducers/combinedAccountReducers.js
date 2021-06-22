import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import account from '../../reducers/account'
import staking from '../../reducers/staking'

import transactions from './transactions'
import allAccounts from './allAccounts'
import availableAccounts from './availableAccounts'
import flowLimitation from './flowLimitation'
import recoveryMethods from './recoveryMethods'
import ledger from './ledger'
import status from './status'
import sign from './sign'

export default (history) => combineReducers({
    // localize: localizeReducer,
    allAccounts,
    availableAccounts,
    // account,
    transactions,
    sign,
    recoveryMethods,
    ledger,
    // staking,
    status,
    flowLimitation,
    // router: connectRouter(history)
})
