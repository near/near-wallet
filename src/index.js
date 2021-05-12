import "regenerator-runtime/runtime";

import React from 'react'
import ReactDOM from 'react-dom'

import { initSentry } from './utils/sentry'
import Routing from './components/Routing'
import StoreConfiguration from './redux/store'

initSentry();

ReactDOM.render(
    <StoreConfiguration>
        <Routing history={history} />
    </StoreConfiguration>,
    document.getElementById('root')
)
