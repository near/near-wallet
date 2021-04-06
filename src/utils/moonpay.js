import sendJson from 'fetch-send-json'
import { ACCOUNT_HELPER_URL } from '../utils/wallet'

const MOONPAY_API_URL = process.env.MOONPAY_API_URL || 'https://api.moonpay.com'
const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY || 'pk_test_wQDTsWBsvUm7cPiz9XowdtNeL5xasP9'
export const MOONPAY_BUY_URL = `${process.env.MOONPAY_BUY_URL || 'https://buy.moonpay.io?apiKey='}${MOONPAY_API_KEY}`

export const isMoonpayAvailable = async () => {
    const moonpayGet = (path) => sendJson('GET', `${MOONPAY_API_URL}${path}?apiKey=${MOONPAY_API_KEY}`)
    const isAllowed = ({ isAllowed, isBuyAllowed }) => isAllowed && isBuyAllowed

    const [ipAddressInfo, countries, currencies] = await Promise.all([
        moonpayGet('/v4/ip_address'),
        moonpayGet('/v3/countries'),
        moonpayGet('/v3/currencies')
    ])

    if (!isAllowed(ipAddressInfo)) {
        return false
    }
    const { alpha2, alpha3, state } = ipAddressInfo

    const country = countries.find(c => c.alpha2 === alpha2 && c.alpha3 === alpha3) || {}
    if (!isAllowed(country)) {
        return false
    }

    const currency = currencies.find(({ code }) => code === 'near') || {}
    const { isSupportedInUS, notAllowedUSStates } = currency

    if (alpha2 === 'US' && (!isSupportedInUS || notAllowedUSStates.includes(state))) {
        return false
    }

    return true
}

export const getSignedUrl = async (accountId, redirectUrl) => {
    const widgetUrl = `${MOONPAY_BUY_URL}&walletAddress=${encodeURIComponent(accountId)}&currencyCode=NEAR&redirectURL=${encodeURIComponent(window.location.href)}`
    const { signature } = await sendJson('GET', `${ACCOUNT_HELPER_URL}/moonpay/signURL?url=${encodeURIComponent(widgetUrl)}`)
    return `${widgetUrl}&signature=${encodeURIComponent(signature)}`
}