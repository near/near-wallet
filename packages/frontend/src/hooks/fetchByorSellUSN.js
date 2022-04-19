<<<<<<< HEAD
import * as nearApiJs from "near-api-js";
import { useState } from "react";
import { IS_MAINNET } from "../config";
import { parseTokenAmount } from "../utils/amounts";
import { wallet } from "../utils/wallet";
=======
import * as nearApiJs from 'near-api-js';
import { useState } from 'react';

import { IS_MAINNET } from '../config';
import { parseTokenAmount } from '../utils/amounts';
import { wallet } from '../utils/wallet';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

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
<<<<<<< HEAD
    }
}
=======
    };
};
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

const setArgsUSNContractSell = (amount, multiplier, slippage, USNamount) => {
    return {
        args: {
            amount: USNamount ? USNamount : parseTokenAmount(amount * (10 ** 18), 0),
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
<<<<<<< HEAD
    }
}

export const useFetchByorSellUSN = () => {
    const [isLoading, setIsLoading] = useState(false);
    const contractName = !IS_MAINNET ? "usdn.testnet" : "usn";
    const usnMethods = {
        viewMethods: ["version", "name", "symbol", "decimals", "ft_balance_of"],
        changeMethods: ["buy", "sell"],
=======
    };
};

export const useFetchByorSellUSN = () => {
    const [isLoading, setIsLoading] = useState(false);
    const contractName = !IS_MAINNET ? 'usdn.testnet' : 'usn';
    const usnMethods = {
        viewMethods: ['version', 'name', 'symbol', 'decimals', 'ft_balance_of'],
        changeMethods: ['buy', 'sell'],
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
    };

    const fetchByOrSell = async (
        accountId,
        multiplier,
        slippage,
        amount,
        symbol,
        USNamount
    ) => {
        const account = await wallet.getAccount(accountId);
        const usnContract = new nearApiJs.Contract(
            account,
            contractName,
            usnMethods
        );
       
<<<<<<< HEAD
        if (symbol === "NEAR") {
=======
        if (symbol === 'NEAR') {
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
            await usnContract.buy(setArgsUSNContractBuy(multiplier, slippage, amount));
           
        } else {
           await usnContract.sell(setArgsUSNContractSell(amount, multiplier, slippage, USNamount));
        }
    };

    return { fetchByOrSell, isLoading, setIsLoading};
};
