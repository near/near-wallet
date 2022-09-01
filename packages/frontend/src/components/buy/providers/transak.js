import { stringifyUrl } from 'query-string';

import { TRANSAK_API_KEY, TRANSAK_BUY_URL } from '../../../config';

export function buildTransakPayLink(accountId) {
    const url = {
        url: TRANSAK_BUY_URL,
        query: {
            apiKey: TRANSAK_API_KEY,
            cryptoCurrencyList: 'NEAR',
            walletAddress: accountId,
            disableWalletAddressForm: true,
            defaultCryptoAmount: '10',
            defaultCryptoCurrency: 'NEAR',
            redirectUrl: window.location.origin
        },
    };

    return stringifyUrl(url);
}
