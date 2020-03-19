import thunk from 'redux-thunk'
import { applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'connected-react-router'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

/**
 * Lets you dispatch special actions with a { promise } field.
 *
 * This middleware will turn them into a single action at the beginning,
 * and a single success (or failure) action when the `promise` resolves.
 *
 * For convenience, `dispatch` will return the promise so the caller can wait.
 */
const readyStatePromise = store => next => action => {
    if (!action.payload || !action.payload.then) {
        return next(action)
    }

    function makeAction(ready, data) {
        const newAction = Object.assign({}, action)
        delete newAction.payload
        return Object.assign(newAction, { ready }, data)
    }

    next(makeAction(false))
    return action.payload.then(
        payload => next(makeAction(true, { payload })),
        error => {
            console.warn('Error in background action:', error)
            return next(makeAction(true, { error: true, payload: error }))
        }
    )
}

/**
 * Track key user actions in Google Analytics and Amplitude
 */
const ACTIONS_TO_TRACK = ['CREATE_NEW_ACCOUNT','ADD_ACCESS_KEY', 
'SETUP_ACCOUNT_RECOVERY', 'RECOVER_ACCOUNT','REMOVE_ACCESS_KEY']

const analyticsMiddleware = store => next => action => {
    let details = {
        pathname: window.location.pathname,
    }
    if (window.gtag && ACTIONS_TO_TRACK.includes(action.type)) {
        window.gtag('event', 'action', {
            event_category: action.type,
            event_label: JSON.stringify(action.type)
        })
    }
    if (window.amplitude) {
        window.amplitude.getInstance().logEvent(action.type, details);
    }
    return next(action);
}

export default (history) => composeEnhancers(
        applyMiddleware(
                routerMiddleware(history),
                thunk,
                readyStatePromise,
                analyticsMiddleware))
