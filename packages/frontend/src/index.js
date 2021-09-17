import "regenerator-runtime/runtime";

import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { LocalizeProvider } from 'react-localize-redux';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Routing from './components/Routing';
import createRootReducer from './redux/combineReducers';
import createMiddleware from './redux/middleware';
import { initSentry } from './utils/sentry';
import { RECAPTCHA_ENTERPRISE_SITE_KEY } from './utils/wallet';

initSentry();

const history = createBrowserHistory();

export const store = createStore(createRootReducer(history), createMiddleware(history));

ReactDOM.render(
    <GoogleReCaptchaProvider
        reCaptchaKey={RECAPTCHA_ENTERPRISE_SITE_KEY}
        useRecaptchaNet={true}
        useEnterprise={true}
    >
        <Provider store={store}>
            <LocalizeProvider store={store}>
                <Routing history={history}/>
            </LocalizeProvider>
        </Provider>
    </GoogleReCaptchaProvider>,
    document.getElementById('root')
);
