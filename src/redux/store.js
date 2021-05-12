import React from 'react'
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createBrowserHistory } from 'history'

import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { PersistGate } from 'redux-persist/integration/react'

import createRootReducer from '../reducers'
import createMiddleware from '../middleware'

const persistConfig = {
    key: 'root',
    storage,
}

const history = createBrowserHistory()

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

export const store = createStore(persistedReducer, createMiddleware(history))

let persistor = persistStore(store)

export default ({ children }) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <LocalizeProvider store={store}>
                {children}
            </LocalizeProvider>
        </PersistGate>
    </Provider>
)
