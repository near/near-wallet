import sendJson from 'fetch-send-json';

import {
    ACCOUNT_HELPER_URL,
    MOONPAY_API_KEY,
    MOONPAY_API_URL,
    MOONPAY_BUY_URL,
} from '../config';

export const MOONPAY_BUY_URL_PREFIX = `${MOONPAY_BUY_URL}${MOONPAY_API_KEY}`;

export const isMoonpayAvailable = async () => {
    const moonpayGet = (path) => sendJson('GET', `${MOONPAY_API_URL}${path}?apiKey=${MOONPAY_API_KEY}`);
    const isAllowed = ({ isAllowed, isBuyAllowed }) => isAllowed && isBuyAllowed;

    const [ipAddressInfo, countries, currencies] = await Promise.all([
        moonpayGet('/v4/ip_address'),
        moonpayGet('/v3/countries'),
        moonpayGet('/v3/currencies')
    ]);

    if (!isAllowed(ipAddressInfo)) {
        return false;
    }
    const { alpha2, alpha3, state } = ipAddressInfo;

    const country = countries.find(c => c.alpha2 === alpha2 && c.alpha3 === alpha3) || {};
    if (!isAllowed(country)) {
        return false;
    }

    const currency = currencies.find(({ code }) => code === 'near') || {};
    const { isSupportedInUS, notAllowedUSStates } = currency;

    if (alpha2 === 'US' && (!isSupportedInUS || notAllowedUSStates.includes(state))) {
        return false;
    }

    return true;
};

export const getSignedUrl = async (accountId, redirectUrl) => {
    const widgetUrl = `${MOONPAY_BUY_URL_PREFIX}`
        + `&walletAddress=${encodeURIComponent(accountId)}`
        + `&currencyCode=NEAR`
        + `&baseCurrencyCode=usd`
        + `&redirectURL=${encodeURIComponent(redirectUrl)}`
    ;
    const { signature } = await sendJson('GET', `${ACCOUNT_HELPER_URL}/moonpay/signURL?url=${encodeURIComponent(widgetUrl)}`);
    return `${widgetUrl}&signature=${encodeURIComponent(signature)}`;
};