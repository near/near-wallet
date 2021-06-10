import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import allAccounts from '../../reducers/allAccounts'
import availableAccounts from '../../reducers/available-accounts'
import account from '../../reducers/account'
import sign from '../../reducers/sign'
import recoveryMethods from '../../reducers/recoveryMethods'
import ledger from '../../reducers/ledger'
import staking from '../../reducers/staking'
import status from '../../reducers/status'
import flowLimitation from '../../reducers/flowLimitation'

import transactions from './transactions'

export default (history) => combineReducers({
    // localize: localizeReducer,
    // allAccounts,
    // availableAccounts,
    // account,
    transactions,
    // sign,
    // recoveryMethods,
    // ledger,
    // staking,
    // status,
    // flowLimitation,
    // router: connectRouter(history)
})
