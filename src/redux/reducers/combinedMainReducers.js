import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

import status from './status'
import ledger from './ledger'

export default (history) => ({
    localize: localizeReducer,
    router: connectRouter(history),
    statusMain: status,
    ledger
})
