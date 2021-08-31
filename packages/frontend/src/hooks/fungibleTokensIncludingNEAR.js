import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectBalance } from '../reducers/account';
import { selectTokensDetails } from '../reducers/tokens';
import { selectNearTokenFiatValueUSD } from '../slices/tokenFiatValues';

const fungibleTokensIncludingNEAR = (tokens, balance, nearTokenFiatValueUSD) => {
    return [
        {
            balance,
            symbol: 'NEAR',
            usd: nearTokenFiatValueUSD
        },
        ...Object.values(tokens)
    ];
};

export const useFungibleTokensIncludingNEAR = function () {
    const balance = useSelector(selectBalance);
    const tokens = useSelector(selectTokensDetails);
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