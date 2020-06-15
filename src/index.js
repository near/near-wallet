import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { initSentry } from './utils/sentry'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { createBrowserHistory } from 'history'

import createRootReducer from './reducers'
import createMiddleware from './middleware'

import Routing from './components/Routing'

initSentry();

const history = createBrowserHistory()

export const store = createStore(createRootReducer(history), createMiddleware(history))

ReactDOM.render(
    <Provider store={store}>
        <LocalizeProvider store={store}>
            <Routing history={history} />
        </LocalizeProvider>
    </Provider>,
    document.getElementById('root')
)
