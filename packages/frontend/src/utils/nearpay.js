import sendJson from "fetch-send-json";

import {
    ACCOUNT_HELPER_URL,
    NEARPAY_API_KEY,
    NEARPAY_API_URL,
    NEARPAY_BUY_URL,
} from "../config";

export const NEARPAY_BUY_URL_PREFIX = `${NEARPAY_BUY_URL}${NEARPAY_API_KEY}`;

const makeBuyCryptoUrl = ({ toWallet, toCurrency, signature }) => {
    const params = new URLSearchParams({
        toWallet,
        toCurrency,
        apiKey: NEARPAY_API_KEY,
        signature: signature,
    }).toString();

    return `${NEARPAY_BUY_URL}?${params}`;
};

const getSignature = async ({ toWallet, toCurrency }) => {
    const url = `${ACCOUNT_HELPER_URL}/nearpay/signURL?${new URLSearchParams({
        toWallet,
        toCurrency,
    }).toString()}`;

    const { signature } = await sendJson("GET", url);

    return signature;
};


export const isAvailable = async () => {
    const nearpayGet = (path) => sendJson('GET', `${NEARPAY_API_URL}/${path}?apiKey=${NEARPAY_API_KEY}`);
    try {
        const { result } = await nearpayGet('v1/merchants/widget-availability');
        return result.available;
    } catch (error) {
        return false;
    }
};


export const getSignedUrl = async (accountId) => {
    const params = { toWallet: accountId, toCurrency: "NEAR" };
    const { signature } = await getSignature(params);
    const url = makeBuyCryptoUrl({ ...params, signature });

    return url;
};
