import thunk from 'redux-thunk'
import { applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default (history) => composeEnhancers(
    applyMiddleware(
        routerMiddleware(history),
        thunk))
