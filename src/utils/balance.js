import BN from 'bn.js';
import { utils } from 'near-api-js';

const FRAC_DIGITS = 5;
export const YOCTO_NEAR_THRESHOLD = new BN('10', 10).pow(new BN(utils.format.NEAR_NOMINATION_EXP - FRAC_DIGITS + 1, 10));

export const formatNearAmount = (amount) => {
    amount = amount.toString();
    if (amount === '0') {
        return amount;
    }
    let formattedAmount = utils.format.formatNearAmount(amount, FRAC_DIGITS);
    if (formattedAmount === '0') {
        return `< ${!FRAC_DIGITS ? `0` : `0.${'0'.repeat((FRAC_DIGITS || 1) - 1)}1`}`;
    }
    return formattedAmount;
};

export const showInYocto = (amountStr) => {
    return formatWithCommas(amountStr) + ' yoctoNEAR';
};

export const formatWithCommas = (value) => {
    const pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(value)) {
        value = value.toString().replace(pattern, '$1,$2');
    }
    return value;
};