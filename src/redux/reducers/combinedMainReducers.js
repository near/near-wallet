import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import account from '../../reducers/account'

export default (history) => ({
    localize: localizeReducer,
    router: connectRouter(history),

    // to be removed after redux refactor finish
    account,
})
