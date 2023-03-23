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
import okex from '../components/buy/assets/okex.svg';
import okx from '../components/buy/assets/okx.svg';
import onRamper from '../components/buy/assets/onRamper.svg';
import payNear from '../components/buy/assets/payNear.svg';
import rainbow from '../components/buy/assets/rainbow.svg';
import rampNetwork from '../components/buy/assets/rampNetwork.svg';
import transakLogo from '../components/buy/assets/transak.svg';
import upbit from '../components/buy/assets/upbit.svg';
import utorg from '../components/buy/assets/utorg.svg';
import wirex from '../components/buy/assets/wirex.svg';
import wormhole from '../components/buy/assets/wormhole.svg';
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
        coinbase: {
            icon: coinbase,
            name: 'Coinbase',
            link: 'https://www.coinbase.com/price/near-protocol',
            track: () => Mixpanel.track('Wallet Click Exchange with Coinbase'),
        },
        onRamper: {
            icon: onRamper,
            name: 'OnRamper',
            link: 'https://widget.onramper.com/?apiKey=pk_prod_0R0gO4xYvtXeNpWXjhFtF0hf8uCrTXL48t0p9TDiz9g0&defaultCrypto=NEAR&wallets=NEAR:kenjon.near&darkMode=true&language=en',
            track: () => Mixpanel.track('Wallet Click Exchange with OnRamper'),
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
        rampNetwork: {
            icon: rampNetwork,
            name: 'Ramp Network',
            link: 'https://ramp.network/',
            track: () => Mixpanel.track('Wallet Click Exchange with Ramp Network'),
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
        okx: {
            icon: okx,
            name: 'OKX',
            link: 'https://www.okx.com/buy-near',
            track: () => Mixpanel.track('Wallet Click Exchange with OKX'),
        },
        bitstamp: {
            icon: bitstamp,
            name: 'Bitstamp',
            link: 'https://www.bitstamp.net/markets/near/usd',
            track: () => Mixpanel.track('Wallet Click Exchange with Bitstamp'),
        },
        wirex: {
            icon: wirex,
            name: 'Wirex',
            link: 'https://wirexapp.com/',
            track: () => Mixpanel.track('Wallet Click Exchange with Wirex'),
        },
        upbit: {
            icon: upbit,
            name: 'Upbit',
            link: 'https://upbit.com/exchange?code=CRIX.UPBIT.KRW-NEAR',
            track: () => Mixpanel.track('Wallet Click Exchange with Upbit'),
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
        wormhole: {
            icon: wormhole,
            name: 'Wormhole',
            link: 'https://wormhole.com/',
            track: () => Mixpanel.track('Wallet Click Exchange with Wormhole'),
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
