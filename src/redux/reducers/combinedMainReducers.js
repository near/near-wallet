import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import account from '../../reducers/account'
import transactions from '../../reducers/transactions'
import sign from '../../reducers/sign'
import staking from '../../reducers/staking'
import status from '../../reducers/status'

export default (history) => ({
    localize: localizeReducer,
    router: connectRouter(history),

    // to be removed after redux refactor finish
    account,
    transactions,
    sign,
    staking,
    status,
})
