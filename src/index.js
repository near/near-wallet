import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import storage from 'redux-persist/lib/storage'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';

import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import createRootReducer from './reducers'
import createMiddleware from './middleware'
import { initSentry } from './utils/sentry'
import Routing from './components/Routing'

import { ACCOUNT_ID_SUFFIX } from './utils/wallet'

initSentry();

const persistConfig = {
    key: `wallet.near.org:${ACCOUNT_ID_SUFFIX}`,
    storage,
    blacklist: ['status', 'staking'],
    writeFailHandler: (error) => {
        if (error.name === 'QuotaExceededError') {
            persistor.pause()
        }
    }
}

export const history = createBrowserHistory()

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

export const store = createStore(persistedReducer, createMiddleware(history))

let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <LocalizeProvider store={store}>
                <Routing history={history} />
            </LocalizeProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
)
