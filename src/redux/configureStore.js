
import { createStore } from 'redux'
import { createBrowserHistory } from 'history'

import createRootReducer from './reducers'
import createMiddleware from './middleware'

import { wallet } from '../utils/wallet'

export const history = createBrowserHistory()

export default () => {
    const store = createStore(createRootReducer(history, Object.keys(wallet.accounts)), createMiddleware(history))


    return store
}
