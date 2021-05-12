import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { initSentry } from './utils/sentry'
import { Provider } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux';
import { PersistGate } from 'redux-persist/integration/react'

import Routing from './components/Routing'
import { store, persistor, history } from './redux/store'

initSentry();

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
