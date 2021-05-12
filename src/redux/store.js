import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createBrowserHistory } from 'history'

import createRootReducer from '../reducers'
import createMiddleware from '../middleware'

const persistConfig = {
    key: 'root',
    storage,
}

export const history = createBrowserHistory()

const persistedReducer = persistReducer(persistConfig, createRootReducer(history))

export const store = createStore(persistedReducer, createMiddleware(history))

export let persistor = persistStore(store)
