import * as nearApiJs from 'near-api-js';
import { useEffect, useState } from 'react';

import { IS_MAINNET } from '../../config';
import { parseTokenAmount } from '../../utils/amounts';
import { wallet } from '../../utils/wallet';

export const currentToken = (tokens, value) => {
    return tokens.find((el) => el.onChainFTMetadata.symbol === value);
};

export const swapTokens = (tokens, from, setFrom, setTo, to) => {
    if (to?.balance === '0' || !to?.balance) return;

    if (from?.onChainFTMetadata?.symbol === 'NEAR') {
        setFrom(currentToken(tokens, 'USN'));
        setTo(tokens[0]);
    } else {
        setFrom(tokens[0]);
        setTo(currentToken(tokens, 'USN'));
    }
};

export const exchangeRateTranslation = ({ token, balance, exchangeRate }) => {
    return token?.onChainFTMetadata?.symbol === 'NEAR'
        ? balance / exchangeRate
        : balance * exchangeRate;
};

export const tradingFree = ({ token, balance, exchangeRate }) => {
    return token === 'NEAR'
        ? (balance / exchangeRate) * 0.002
        : balance * exchangeRate * 0.002;
};

export const MinimumReceived = ({ token, balance, exchangeRate }) => {
    return token === 'NEAR' ? balance / exchangeRate : balance * exchangeRate;
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

export const commission = ({ accountId, amount, delay, exchangeRate, token, isSwapped }) => {
    const [commissionFree, setCommissionFree] = useState('');
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
                setCommissionFree(commission);
                setIsLoadingCommission(false);
            }
        };

        getCommission();
    }, [debounceValue, exchangeRate, isSwapped]);

    return { commissionFree, isLoadingCommission };
};
