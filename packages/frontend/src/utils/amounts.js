import Big from 'big.js';

import { MAX_PERCENTAGE } from './constants';

const APPROX_ZERO_MIN = 10;

export const BOATLOAD_OF_GAS = Big(1).times(10 ** 14).toFixed();

// TODO: Shouldn't do 10 ** 24 with JS number, also use big decimal. Might fix precision errors.
export const toNear = (value = '0') => Big(value).times(10 ** 24).toFixed();
export const nearTo = (value = '0', to = 2) => Big(value).div(10 ** 24).toFixed(to === 0 ? undefined : to);
export const big = (value = '0') => Big(value);
export const gtZero = (value = '0') => big(value).gt(big());
export const gtZeroApprox = (value = '0') => big(value).gt(big(APPROX_ZERO_MIN));

export const cutDecimalsIfNeeded = (value, precision) => {
    if (!value || !precision) {
        return String(value);
    }

    const strValue = String(value);
    const decimalPointIndex = strValue.indexOf('.');
    const lengthOfDecimalPlaces = decimalPointIndex
        ? strValue.slice(decimalPointIndex + 1).length
        : 0;
    const remaningAmount = Number(
        strValue.slice(decimalPointIndex + 1, precision + 1)
    );

    if (!precision || !lengthOfDecimalPlaces || lengthOfDecimalPlaces <= precision || !remaningAmount) {
        return Big(value).toFixed();
    }

    return Big(value).toFixed(precision);
};

export const formatTokenAmount = (value, decimals = 18, precision = 2) => value && Big(value).div(Big(10).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value, decimals = 18, precision = 0) => value && Big(value).times(Big(10).pow(decimals)).toFixed(precision);
export const removeTrailingZeros = (amount) => amount.replace(/\.?0*$/, '');

export const getPercentFrom = (value, percent) => {
    return Big(value).div(MAX_PERCENTAGE).times(percent).toFixed();
};

export const decreaseByPercent = (value, percent, precision = 0) => {
    return Big(value)
        .minus(Big(value).div(MAX_PERCENTAGE).times(percent))
        .toFixed(precision);
};


const MAX_DECIMALS = 24;

export const isValidAmount = (amount, maxAmount, decimals = MAX_DECIMALS) => {
    // Allow empty values
    if (!String(amount).length) {
        return true;
    }

    // Firstly check NaN, because "big.js" cannot work with such values
    if (Number.isNaN(Number(amount))) {
        return false;
    }

    const fixedAmount = Big(amount).toFixed();
    const isMoreThanAllowed = maxAmount && Big(amount).gt(maxAmount);

    if (!fixedAmount.match(/^\d*(\.)?(\d+)?$/) || isMoreThanAllowed) {
        return false;
    }

    const strAmount = fixedAmount.replace(/,/g, '.');
    const fractionalPart = strAmount?.split('.')[1];

    if (fractionalPart && fractionalPart?.length > decimals) {
        return false;
    }

    return true;
};
