import binance from '../components/buy/assets/binance.svg';
import huobi from '../components/buy/assets/huobi.svg';
import kraken from '../components/buy/assets/kraken.svg';
import monoPay from '../components/buy/assets/monoPay.svg';
import okex from '../components/buy/assets/okex.svg';
import payNear from '../components/buy/assets/payNear.svg';
import rainbow from '../components/buy/assets/rainbow.svg';
import transakLogo from '../components/buy/assets/transak.svg';
import utorg from '../components/buy/assets/utorg.svg';
import { Mixpanel } from '../mixpanel';

export const getPayMethods = ({
    accountId,
    moonPayAvailable,
    signedMoonPayUrl,
    utorgPayUrl,
    transakPayUrl,
}) => {
    const paymentMethods = {
        moonPay: {
            disabled: accountId && !moonPayAvailable,
            icon: monoPay,
            name: 'MoonPay',
            link: signedMoonPayUrl,
            track: () => Mixpanel.track('Wallet Click Buy with Moonpay'),
        },
        nearPay: {
            icon: payNear,
            name: 'NearPay',
            link: 'https://widget.nearpay.co/',
            track: () => Mixpanel.track('Wallet Click Buy with Nearpay'),
        },
        utorg: {
            icon: utorg,
            name: 'UTORG',
            link: utorgPayUrl,
            provideReferrer: true,
            track: () => Mixpanel.track('Wallet Click Buy with UTORG'),
        },
        transak: {
            icon: transakLogo,
            name: 'Transak',
            link: transakPayUrl,
            track: () => Mixpanel.track('Wallet Click Buy with Transak'),
        },
        rainbow: {
            icon: rainbow,
            name: 'Rainbow Bridge',
            link: 'https://rainbowbridge.app/transfer',
            track: () =>
                Mixpanel.track('Wallet Click Bridge with Rainbow Bridge'),
        },
        okex: {
            icon: okex,
            name: 'Okex',
            link: 'https://www.okx.com/markets/prices/near-protocol-near',
            track: () => Mixpanel.track('Wallet Click Exchange with Okex'),
        },
        binance: {
            icon: binance,
            name: 'Binance',
            link: 'https://www.binance.com/en/price/near-protocol',
            track: () => Mixpanel.track('Wallet Click Exchange with Binance'),
        },
        huobi: {
            icon: huobi,
            name: 'Huobi',
            link: 'https://www.huobi.com/en-us/asset-introduction/details/?currency=near',
            track: () => Mixpanel.track('Wallet Click Exchange with Huobi'),
        },
        kraken: {
            icon: kraken,
            name: 'Kraken',
            link: 'https://www.kraken.com/prices/near-near-protocol-price-chart/usd-us-dollar?interval=1m',
            track: () => Mixpanel.track('Wallet Click Exchange with Kraken'),
        },
    };


    return paymentMethods;
};
