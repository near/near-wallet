import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from '@sentry/browser';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { createBrowserHistory } from 'history'

import createRootReducer from './reducers'
import createMiddleware from './middleware'

import Routing from './components/Routing'

const SENTRY_RELEASE = process.env.SENTRY_RELEASE ||
    (process.env.RENDER &&
        `render:${process.env.RENDER_SERVICE_NAME}:${process.env.RENDER_GIT_BRANCH}:${process.env.RENDER_GIT_COMMIT}`)
    || 'development';

Sentry.init({
    dsn: "https://75d1dabd0ab646329fad8a3e7d6c761d@o398573.ingest.sentry.io/5254526",
    release: SENTRY_RELEASE
});

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
