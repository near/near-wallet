import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId, selectBalance } from '../redux/slices/account';
import { selectNearTokenFiatValueUSD } from '../redux/slices/tokenFiatValues';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';


const getNearInTokenFormat = (balance, nearTokenFiatValueUSD) => {
    return {
        balance,
        symbol: 'NEAR',
        usd: nearTokenFiatValueUSD
    }
}

const fungibleTokensIncludingNEAR = (tokens, balance, nearTokenFiatValueUSD) => {
    return [
        getNearInTokenFormat(balance, nearTokenFiatValueUSD)
        ,
        ...Object.values(tokens)
    ];
};

export const useFungibleTokensIncludingNEAR = function () {
    const balance = useSelector(selectBalance);
    const accountId = useSelector(selectAccountId);
    const tokens = useSelector((state) => selectTokensWithMetadataForAccountId(state, { accountId }));
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    const balanceToDisplay = balance?.balanceAvailable;
    const [fungibleTokensList, setFungibleTokensList] = useState(
        () => fungibleTokensIncludingNEAR(tokens, balanceToDisplay)
    );

    useEffect(() => {
        setFungibleTokensList(fungibleTokensIncludingNEAR(tokens, balanceToDisplay, nearTokenFiatValueUSD));
    }, [tokens, balanceToDisplay]);

    return fungibleTokensList;
};


export const useNear = () => {
    const balance = useSelector(selectBalance);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const balanceToDisplay = balance?.balanceAvailable;

    const [nearToken, setNearToken] = useState(
        () => getNearInTokenFormat(balanceToDisplay, nearTokenFiatValueUSD)
    );

    useEffect(() => {
        setNearToken(getNearInTokenFormat(balanceToDisplay, nearTokenFiatValueUSD));
    }, [balance, nearTokenFiatValueUSD]);

    return nearToken;
}
