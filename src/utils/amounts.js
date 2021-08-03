
import Big from 'big.js';

import { formatNearAmount } from './balance';

export const BOATLOAD_OF_GAS = Big(1).times(10 ** 14).toFixed();
const APPROX_ZERO_MIN = 10;

// TODO: Shouldn't do 10 ** 24 with JS number, also use big decimal. Might fix precision errors.
export const toNear = (value = '0') => Big(value).times(10 ** 24).toFixed();
export const nearTo = (value = '0', to = 2) => Big(value).div(10 ** 24).toFixed(to === 0 ? undefined : to);
export const big = (value = '0') => Big(value);
export const gtZero = (value = '0') => big(value).gt(big());
export const gtZeroApprox = (value = '0') => big(value).gt(big(APPROX_ZERO_MIN));

export const formatTokenAmount = (value, decimals = 18, precision = 2) => value && Big(value).div(Big(10).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value, decimals = 18) => value && Big(value).times(Big(10).pow(decimals)).toFixed();
export const removeTrailingZeros = (amount) => amount.replace(/\.?0*$/, '');

export const getRoundedBalanceInFiat = (rawNearAmount, tokenFiatValue) => {
    const formattedNearAmount = rawNearAmount && formatNearAmount(rawNearAmount);
    const balanceInFiat = Number(formattedNearAmount) * tokenFiatValue;
    const roundedBalanceInFiat = balanceInFiat && balanceInFiat.toFixed(2);
    if (roundedBalanceInFiat === '0.00' || formattedNearAmount === '< 0.00001') {
        return '< 0.01';
    }
    return roundedBalanceInFiat;
};

export const getNearAndFiatValue = (rawNearAmount, tokenFiatValue, fiat = 'usd') => {
    const nearAmount = formatNearAmount(rawNearAmount);
    const fiatAmount = getRoundedBalanceInFiat(rawNearAmount, tokenFiatValue);
    const fiatSymbol = fiat.toUpperCase();
    const fiatPrefix = fiatAmount !== '< 0.01' ? '≈ ' : '';
    return `${nearAmount} NEAR (${fiatPrefix}${fiatAmount || '—'} ${fiatSymbol})`;
};