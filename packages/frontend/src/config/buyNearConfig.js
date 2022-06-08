import binance from '../components/buy/assets/binance.svg';
import huobi from '../components/buy/assets/huobi.svg';
import monoPay from '../components/buy/assets/monoPay.svg';
import okex from '../components/buy/assets/okex.svg';
import payNear from '../components/buy/assets/payNear.svg';
import rainbow from '../components/buy/assets/rainbow.svg';
import utorg from '../components/buy/assets/utorg.svg';
import { Mixpanel } from '../mixpanel';

export const getPayMethods = ({ accountId, moonPayAvailable, signedMoonPayUrl, utorgPayUrl }) => {
    return {
        moonPay: {
            disabled: accountId && !moonPayAvailable,
            icon: monoPay,
            name: 'MoonPay',
            link: signedMoonPayUrl,
            track: () => Mixpanel.track('Wallet Click Buy with Moonpay'),
        },
        nearPay: { icon: payNear, name: 'NearPay', link: 'https://www.nearpay.io/' },
        utorg: { icon: utorg, name: 'UTORG', link: utorgPayUrl, ref: true },
        rainbow: { icon: rainbow, name: 'Rainbow Bridge', link: 'https://rainbowbridge.app/transfer' },
        binance: { icon: okex, name: 'Okex', link: 'https://www.okex.com/' },
        okex: { icon: binance, name: 'Binance', link: 'https://www.binance.com/' },
        huobi: { icon: huobi, name: 'Huobi', link: 'https://c2c.huobi.com/en-us/one-trade/buy' },
    };
};
