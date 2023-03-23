import alchemyPay from '../components/buy/assets/alchemyPay.svg';
import allbridge from '../components/buy/assets/allbridge.svg';
import banxa from '../components/buy/assets/banxa.svg';
import binance from '../components/buy/assets/binance.svg';
import binanceUs from '../components/buy/assets/binanceUs.svg';
import bitstamp from '../components/buy/assets/bitstamp.svg';
import coinbase from '../components/buy/assets/coinbase.svg';
import coinDCX from '../components/buy/assets/coinDCX.svg';
import guardarian from '../components/buy/assets/guardarian.svg';
import huobi from '../components/buy/assets/huobi.svg';
import kraken from '../components/buy/assets/kraken.svg';
import mercuryo from '../components/buy/assets/mercuryo.svg';
import monoPay from '../components/buy/assets/monoPay.svg';
import multichain from '../components/buy/assets/multichain.svg';
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
        coinbase: {
            icon: coinbase,
            name: 'Coinbase',
            link: 'https://www.coinbase.com/price/near-protocol',
            track: () => Mixpanel.track('Wallet Click Exchange with Coinbase'),
        },
        mercuryo: {
            icon: mercuryo,
            name: 'Mercuryo',
            link: 'https://exchange.mercuryo.io/?currency=NEAR&fiat_currency=eur',
            track: () => Mixpanel.track('Wallet Click Exchange with Mercuryo'),
        },
        guardian: {
            icon: guardarian,
            name: 'Guardarian',
            link: 'https://guardarian.com/buy-near',
            track: () => Mixpanel.track('Wallet Click Exchange with Guardarian'),
        },
        banxa: {
            icon: banxa,
            name: 'Banxa',
            link: 'https://banxa.com/',
            track: () => Mixpanel.track('Wallet Click Exchange with Banxa'),
        },
        alchemyPay: {
            icon: alchemyPay,
            name: 'Alchemy Pay',
            link: 'https://alchemypay.org/',
            track: () => Mixpanel.track('Wallet Click Exchange with Alchemy Pay'),
        },
        binanceUs : {
            icon: binanceUs,
            name: 'Binance US',
            link: 'https://www.binance.us/price/near-protocol',
            track: () => Mixpanel.track('Wallet Click Exchange with Binance US'),
        },
        bitstamp: {
            icon: bitstamp,
            name: 'Bitstamp',
            link: 'https://www.bitstamp.net/markets/near/usd',
            track: () => Mixpanel.track('Wallet Click Exchange with Bitstamp'),
        },
        coinDCX: {
            icon: coinDCX,
            name: 'CoinDCX',
            link: 'https://coindcx.com/trade/NEARUSDT',
            track: () => Mixpanel.track('Wallet Click Exchange with CoinDCX'),
        },
        allbridge: {
            icon: allbridge,
            name: 'Allbridge',
            link: 'https://app.allbridge.io/bridge?from=ETH&to=NEAR&asset=ABR&amp_device_id=a51fWZoLgJF7rzFiJM_3Jh',
            track: () => Mixpanel.track('Wallet Click Exchange with Allbridge'),
            blackBackground: true,
        },
        multichain: {
            icon: multichain,
            name: 'Multichain',
            link: 'https://app.multichain.org/#/router?bridgetoken=mpc-multichain.near',
            track: () => Mixpanel.track('Wallet Click Exchange with Multichain'),
        }
    };


    return paymentMethods;
};
