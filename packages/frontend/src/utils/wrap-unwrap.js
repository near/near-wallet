import { removeTrailingZeros } from './amounts';

export const getFormatBalance = (num, decimals) => {
    if (!num || num === '0') {
        return {
            numToShow: '0',
            fullNum: '0',
        };
    }
    let number = '';
    let dotPlace = '';
    for (let i = num.length - 1; i >= 0; i--) {
        if (number.length === decimals) {
            number = '.' + number;
            dotPlace = i;
        }
        number = num[i] + number;
    }
    if (dotPlace || dotPlace === 0) {
        return {
            numToShow: removeTrailingZeros(number.slice(0, dotPlace + 7)),
            fullNum: removeTrailingZeros(number),
        };
    } else {
        if (decimals - number.length > 0) {
            let countOfZeros = decimals - number.length;
            number = '0.' + '0'.repeat(countOfZeros) + number;
            return {
                numToShow: removeTrailingZeros(
                    number.slice(0, 3 + countOfZeros)
                ),
                fullNum: removeTrailingZeros(number),
            };
        } else {
            number = '0.' + number;
            return {
                numToShow: removeTrailingZeros(number.slice(0, 4)),
                fullNum: removeTrailingZeros(number),
            };
        }
    }
};

const getValue = (str, decimals) => {
    const strArr = str.split('.');
    if (!strArr[1]) {
        return strArr[0];
    }
    let number = strArr[1];
    for (let i = 0; i < decimals; i++) {
        if (!strArr[1][i]) {
            number += 0;
            continue;
        }
    }
    return `${strArr[0]}.${number}`;
};

export const validateInput = (value, max) => {
    if (!value || +value === 0) {
        return false;
    }
    value = value.replace(/,/g, '.');
    const strArr = value.split('.');
    if (strArr[1] && strArr[1].length > 24) {
        return false;
    }
    const myTokens = getValue(max, 24);
    const inputTokens = getValue(value, 24);
    if (+inputTokens > +myTokens) {
        return false;
    }
    if (+inputTokens === +myTokens && inputTokens > myTokens) {
        return false;
    }
    return true;
};
