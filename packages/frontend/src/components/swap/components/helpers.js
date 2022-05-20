import * as nearApiJs from 'near-api-js';
import { useEffect, useState, useRef } from 'react';

import { IS_MAINNET } from '../../../config';
import { removeTrailingZeros, formatTokenAmount, parseTokenAmount } from '../../../utils/amounts';
import { wallet } from '../../../utils/wallet';
import { formatNearAmount } from '../../common/balance/helpers';
import { VALID_TOKEN_PAIRS, W_NEAR_PROPS } from '../Swap';

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

export const findTokenSwapToList = ({ tokenSymbol, fungibleTokensList }) => {
    if (!tokenSymbol) {
        return;
    }
    const validTokensToSwapTo = VALID_TOKEN_PAIRS[tokenSymbol];
    const fungibleTokensWithPrices = fungibleTokensList.reduce((accum, current) => {
        if (validTokensToSwapTo.includes(current.onChainFTMetadata.symbol)) {
            accum.push(current);
        }
        return accum;
    }, []);
    const hasWNear = fungibleTokensWithPrices.find((token) => token.onChainFTMetadata?.symbol == 'wNEAR');
    if (!hasWNear && validTokensToSwapTo.includes('wNEAR')) {
        fungibleTokensWithPrices.push(W_NEAR_PROPS);
    }
    return fungibleTokensWithPrices;
};

// USN Logic below

export const getBalance = (activeTokenFrom) => {
    return activeTokenFrom?.onChainFTMetadata?.symbol === 'NEAR'
        ? +formatNearAmount(activeTokenFrom?.balance)
        : +formatTokenAmount(activeTokenFrom?.balance, activeTokenFrom?.onChainFTMetadata?.decimals, 5);
};

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value]);

    return debouncedValue;
};

const roundUSNExchange = (amount, exchangeRate) => {
    const currentExchangeRate = +exchangeRate / 10000;

    return amount * currentExchangeRate;
};

async function fetchCommission({ accountId, amount, exchangeRate, token }) {
    const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
    const currentToken = token?.onChainFTMetadata?.symbol === 'NEAR';
    const currentExchangeRate = +exchangeRate / 10000;
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of', 'spread'],
        changeMethods: ['buy', 'sell'],
    };
    const account = await wallet.getAccount(accountId);
    const usnContract = new nearApiJs.Contract(
        account,
        contractName,
        usnMethods
    );
    const usnAmount = (currentToken
        ? parseTokenAmount(roundUSNExchange(amount, exchangeRate) * 10 ** 18, 0)
        : parseTokenAmount(amount * 10 ** 18, 0)).toString();
    const result = await usnContract.spread({ amount: usnAmount }) / 1000000;

    return {
        result: currentToken ? (currentExchangeRate * amount) * result : (amount / currentExchangeRate) * result,
        percent: Number(result * 100)?.toFixed(2)
    };
}

export const commission = ({ accountId, amount, delay, exchangeRate, token }) => {
    const [commissionFee, setCommissionFee] = useState('');
    const [isLoadingCommission, setIsLoadingCommission] = useState(false);
    const debounceValue = useDebounce(amount, delay);

    useEffect(() => {
        const getCommission = async () => {
            if (debounceValue) {
                setIsLoadingCommission(true);
                const commission = await fetchCommission({
                    accountId,
                    amount: debounceValue,
                    exchangeRate,
                    token,
                });
                setCommissionFee(commission);
                setIsLoadingCommission(false);
            }
        };

        getCommission();
    }, [debounceValue, exchangeRate]);

    return { commissionFee, isLoadingCommission };
};

export const exchangeRateTranslation = ({ inputtedAmountOfToken, calculateAmountOfToken, balance, exchangeRate }) => {
    if (!balance) return;

    const convertBalanceWithExchangeRate = {
        'NEAR->USN': balance * exchangeRate,
        'USN->NEAR': balance / exchangeRate,
        'NEAR->wNEAR': '1:1',
        'wNEAR->NEAR': '1:1'
    };
    
    const activeTokenFromSymbol = inputtedAmountOfToken?.onChainFTMetadata?.symbol;
    const activeTokenToSymbol = calculateAmountOfToken?.onChainFTMetadata?.symbol;
    const operation = convertBalanceWithExchangeRate[`${activeTokenFromSymbol}->${activeTokenToSymbol}`];

    if (operation == '1:1') return balance;
    const removedZeros = removeTrailingZeros(`${operation.toFixed(5)}`);
    return removedZeros;
};


export const useInterval = (cb, interval) => {
  const callback = useRef();

  useEffect(() => {
    callback.current = cb;
  }, [callback]);

  useEffect(() => {
    function tick() {
        callback.current();
    }
    if (interval !== null) {
      const intervalFunction = setInterval(tick, interval);
      return () => clearInterval(intervalFunction);
    }
  }, [interval]);
};
