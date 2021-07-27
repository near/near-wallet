import BN from 'bn.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectBalance } from '../reducers/account';
import { selectTokensDetails } from '../reducers/tokens';
import { WALLET_APP_MIN_AMOUNT } from '../utils/wallet';

const getAvailableNearToSend = (availableBalance, reservedForFees) => {
    const availableToSendBN = new BN(availableBalance).sub(new BN(reservedForFees));
    return availableToSendBN.isNeg() ? '0' : availableToSendBN.toString();
};

const fungibleTokensIncludingNEAR = (tokens, balance) => {
    return [
        {
            balance,
            symbol: 'NEAR'
        },
        ...Object.values(tokens)
    ];
};

export const useFungibleTokensIncludingNEAR = function ({ fullBalance = true }) {
    const balance = useSelector(selectBalance);
    const tokens = useSelector(selectTokensDetails);

    const availableNearBalance = balance?.available;
    const totalNearBalance = balance?.total;
    const availableNearToSend = getAvailableNearToSend(availableNearBalance, parseNearAmount(WALLET_APP_MIN_AMOUNT));

    const balanceToDisplay = fullBalance ? totalNearBalance : availableNearToSend;
    const [fungibleTokensList, setFungibleTokensList] = useState(
        () => fungibleTokensIncludingNEAR(tokens, balanceToDisplay)
    );

    useEffect(() => {
        setFungibleTokensList(fungibleTokensIncludingNEAR(tokens, balanceToDisplay));
    }, [tokens, balanceToDisplay]);

    return fungibleTokensList;
};