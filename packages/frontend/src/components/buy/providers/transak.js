import { stringifyUrl } from 'query-string';

import CONFIG from '../../../config';

export function buildTransakPayLink(accountId) {
    const url = {
        url: CONFIG.TRANSAK_BUY_URL,
        query: {
            apiKey: CONFIG.TRANSAK_API_KEY,
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
