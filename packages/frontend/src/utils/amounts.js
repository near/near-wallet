import Big from 'big.js';

import { MAX_PERCENTAGE, NEAR_DECIMALS } from './constants';

const APPROX_ZERO_MIN = 10;
const YOCTO_NEAR_COEFFICIENT = Big(10).pow(NEAR_DECIMALS).toFixed();

export const BOATLOAD_OF_GAS = Big(1).times(10 ** 14).toFixed();

export const toNear = (value = '0') => Big(value).times(YOCTO_NEAR_COEFFICIENT).toFixed();
export const nearTo = (value = '0', to = 2) => Big(value).div(YOCTO_NEAR_COEFFICIENT).toFixed(to === 0 ? undefined : to);
export const big = (value = '0') => Big(value);
export const gtZero = (value = '0') => big(value).gt(big());
export const gtZeroApprox = (value = '0') => big(value).gt(big(APPROX_ZERO_MIN));

export const formatTokenAmount = (value, decimals = 18, precision = 2) => value && Big(value).div(Big(10).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value, decimals = 18, precision = 0) => value && Big(value).times(Big(10).pow(decimals)).toFixed(precision);
export const removeTrailingZeros = (amount) => amount.replace(/\.?0*$/, '');

export const toSignificantDecimals = (value, precision = 2) => {
    if (!value) {
        return value;
    }

    const fixed = Big(value).toFixed().replace(/,/g, '.');
    const integerPart = fixed?.split('.')[0];
    let fractionalPart = fixed?.split('.')[1];

    if (!fractionalPart) {
        return fixed;
    }

    const fractionalPartWithoutZeros = removeTrailingZeros(fractionalPart);
    const withoutSideZeros = Big(+fractionalPartWithoutZeros).toFixed().replace(/0+$/, '');

    if (withoutSideZeros?.length <= precision) {
        return fixed;
    }

    const startZeros = fractionalPartWithoutZeros.match('^0+')?.[0] || '';
    const croppedPart = `${startZeros}${withoutSideZeros.slice(0, precision)}`;

    if (!croppedPart) {
        return fixed;
    }

    return `${integerPart}.${croppedPart}`;
};

export const getPercentFrom = (value, percent) => {
    return Big(value).div(MAX_PERCENTAGE).times(percent).toFixed();
};

export const decreaseByPercent = (value, percent, precision = 0) => {
    return Big(value)
        .minus(Big(value).div(MAX_PERCENTAGE).times(percent))
        .toFixed(precision);
};

export const isValidAmount = (amount, maxAmount, decimals = NEAR_DECIMALS) => {
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

    if (fractionalPart && fractionalPart.length > decimals) {
        return false;
    }

    return true;
};
