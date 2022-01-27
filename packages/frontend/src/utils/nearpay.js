import sendJson from "fetch-send-json";

import {
    ACCOUNT_HELPER_URL,
    NEARPAY_API_KEY,
    // NEARPAY_API_URL,
    NEARPAY_BUY_URL,
} from "../config";

export const NEARPAY_BUY_URL_PREFIX = `${NEARPAY_BUY_URL}${NEARPAY_API_KEY}`;

const nearpayBuyUrl = ({ receiveCurrencyCode, receiveWallet, signature }) => {
    const params = new URLSearchParams({
        toWallet: receiveWallet,
        toCurrency: receiveCurrencyCode,
        apiKey: NEARPAY_API_KEY,
        signature: signature,
    }).toString();

    return `${NEARPAY_BUY_URL}?${params}`;
};

const getNearpaySignature = async ({ receiveWallet, receiveCurrencyCode }) => {
    const url = `${ACCOUNT_HELPER_URL}/nearpay/signURL?${new URLSearchParams({
        toWallet: receiveWallet,
        toCurrency: receiveCurrencyCode,
        apiKey: NEARPAY_API_KEY,
    }).toString()}`;

    const { signature } = await sendJson("GET", url);

    return signature;
};

export const isNearpayAvailable = async () => {
    return true;
};

export const getSignedUrl = async (accountId) => {
    const params = { receiveWallet: accountId, receiveCurrencyCode: "NEAR" };

    const { signature } =
        {
            signature:
                "57e8b5fb920194b719e0b390d466fb5b717bd2f4dc184e78493a9e1970edd1e2",
        } || (await getNearpaySignature(params));

    const signedUrl = nearpayBuyUrl({ ...params, signature });

    return signedUrl;
};
