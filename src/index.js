import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { initSentry } from './utils/sentry'

import { createStore } from 'redux'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { createBrowserHistory } from 'history'

import createRootReducer from './reducers'
import createMiddleware from './middleware'

import Routing from './components/Routing'

initSentry();

const persistConfig = {
    key: 'root',
    storage,
}

const history = createBrowserHistory()

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
