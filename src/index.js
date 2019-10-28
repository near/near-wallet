import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { createBrowserHistory } from 'history'

import createRootReducer from './reducers'
import createMiddleware from './middleware'

import Routing from './components/Routing'
import * as serviceWorker from './serviceWorker'

const history = createBrowserHistory()

const store = createStore(createRootReducer(history), createMiddleware(history))

ReactDOM.render(
   <Provider store={store}>
      <LocalizeProvider store={store}>
         <Routing history={history} />
      </LocalizeProvider>
   </Provider>,
   document.getElementById('root')
)
serviceWorker.unregister()
