import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import account from '../../reducers/account'
import sign from '../../reducers/sign'
import staking from '../../reducers/staking'

export default (history) => ({
    localize: localizeReducer,
    router: connectRouter(history),

    // to be removed after redux refactor finish
    account,
    sign,
    staking,
})
