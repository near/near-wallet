import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId, selectBalance } from '../redux/slices/account';
import { selectNearTokenFiatValueUSD } from '../redux/slices/tokenFiatValues';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';

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
    const accountId = useSelector(selectAccountId);
    const tokens = useSelector((state) => selectTokensWithMetadataForAccountId(state, { accountId })).sort((a, b) => a.name.localeCompare(b.name));
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