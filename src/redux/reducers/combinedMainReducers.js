import { connectRouter } from 'connected-react-router'
import { localizeReducer } from 'react-localize-redux'

export default (history) => ({
    localize: localizeReducer,
    router: connectRouter(history),
})
