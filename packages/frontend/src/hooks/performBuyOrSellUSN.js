import * as nearApiJs from 'near-api-js';
import { useState } from 'react';

import { IS_MAINNET } from '../config';
import { parseTokenAmount } from '../utils/amounts';
import { wallet } from '../utils/wallet';

const setArgsUSNContractBuy = (multiplier, slippage, amount) => {
    return {
        args: {
            expected: {
                multiplier,
                slippage: `${Math.round(
                    (multiplier / 100) * slippage
                )}`,
                decimals: 28,
            },
        },
        amount: parseTokenAmount(amount * (10 ** 24), 0),
        gas: 50000000000000,
    };
};

const setArgsUSNContractSell = (amount, multiplier, slippage, usnAmount) => {
    return {
        args: {
            amount: usnAmount ? usnAmount : parseTokenAmount(amount * (10 ** 18), 0),
            expected: {
                multiplier,
                slippage: `${Math.round(
                    (multiplier / 100) * slippage
                )}`,
                decimals: 28,
            },
        },
        amount: 1,
        gas: 100000000000000,
    };
};

export const usePerformBuyOrSellUSN = () => {
    const [isLoading, setIsLoading] = useState(false);
    const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of'],
        changeMethods: ['buy', 'sell'],
    };

    const performBuyOrSellUSN = async (
        accountId,
        multiplier,
        slippage,
        amount,
        symbol,
        usnAmount
    ) => {
        const account = await wallet.getAccount(accountId);
        const usnContract = new nearApiJs.Contract(
            account,
            contractName,
            usnMethods
        );
       
        if (symbol === 'NEAR') {
            await usnContract.buy(setArgsUSNContractBuy(multiplier, slippage, amount));
           
        } else {
           await usnContract.sell(setArgsUSNContractSell(amount, multiplier, slippage, usnAmount));
        }
    };

    return { performBuyOrSellUSN, isLoading, setIsLoading};
};
