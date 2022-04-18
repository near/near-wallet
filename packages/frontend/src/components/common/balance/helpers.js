import BN from 'bn.js';
import { utils } from 'near-api-js';

import { formatTokenAmount } from '../../../utils/amounts';

const NEAR_FRACTIONAL_DIGITS = 5;
export const YOCTO_NEAR_THRESHOLD = new BN('10', 10).pow(new BN(utils.format.NEAR_NOMINATION_EXP - NEAR_FRACTIONAL_DIGITS + 1, 10));

export const formatNearAmount = (amount) => {
    amount = amount.toString();
    if (amount === '0') {
        return amount;
    }
    let formattedAmount = utils.format.formatNearAmount(amount, NEAR_FRACTIONAL_DIGITS);
    if (formattedAmount === '0') {
        return `< ${!NEAR_FRACTIONAL_DIGITS ? '0' : `0.${'0'.repeat((NEAR_FRACTIONAL_DIGITS || 1) - 1)}1`}`;
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

export const getRoundedBalanceInFiat = (rawNearAmount, tokenFiatValue,isNear,decimals) => {
    const formattedNearAmount = rawNearAmount && !isNear ? formatNearAmount(rawNearAmount).replace(/,/g, '') : formatTokenAmount(rawNearAmount, decimals);
    const balanceInFiat = Number(formattedNearAmount) * tokenFiatValue;
    const roundedBalanceInFiat = balanceInFiat && balanceInFiat.toFixed(2);
    if (roundedBalanceInFiat === '0.00' || formattedNearAmount === '< 0.00001') {
        return '< $0.01';
    }
    return roundedBalanceInFiat;
};

export const getTotalBalanceInFiat = (mainTokens, currentLanguage) => {
    const totalAmount = mainTokens.map((el) => {
    const USD = el.fiatValueMetadata.usd;
    const balance = el.balance;
      return el.contractName ? getRoundedBalanceInFiat(balance,USD,true,el.onChainFTMetadata.decimals) : getRoundedBalanceInFiat(balance,USD);
    }).reduce((a,b) =>`${+a + +b}`);
    
    return !isNaN(totalAmount) ? new Intl.NumberFormat(`${currentLanguage}`,{maximumFractionDigits:2,minimumFractionDigits:2}).format(totalAmount) :'0';
}; 

export const getNearAndFiatValue = (rawNearAmount, tokenFiatValue, fiat = 'usd') => {
    const nearAmount = formatNearAmount(rawNearAmount);
    const fiatAmount = getRoundedBalanceInFiat(rawNearAmount, tokenFiatValue);
    const fiatSymbol = fiat.toUpperCase();
    const fiatPrefix = fiatAmount !== '< 0.01' ? '≈ ' : '';
    return `${nearAmount} NEAR (${fiatPrefix}${formatWithCommas(fiatAmount) || '—'} ${fiatSymbol})`;
};
