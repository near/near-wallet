import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3-near';
import { LocalizeProvider } from 'react-localize-redux';
import { Provider } from 'react-redux';

import Routing from './components/Routing';
import { RECAPTCHA_ENTERPRISE_SITE_KEY } from './config';
import history from './history';
import store from './store';
import { initSentry } from './utils/sentry';

initSentry();

ReactDOM.render(
    (<GoogleReCaptchaProvider
        reCaptchaKey={RECAPTCHA_ENTERPRISE_SITE_KEY}
        useRecaptchaNet={true}
        useEnterprise={true}
    >
        <Provider store={store}>
            <LocalizeProvider store={store}>
                <Routing history={history}/>
            </LocalizeProvider>
        </Provider>
    </GoogleReCaptchaProvider>),
    document.getElementById('root')
);
