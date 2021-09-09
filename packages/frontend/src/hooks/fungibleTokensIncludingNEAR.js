import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectAccountId, selectBalance } from '../reducers/account';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';
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
    const accountId = useSelector(state => selectAccountId(state));
    const tokens = useSelector(state => selectTokensWithMetadataForAccountId(state, { accountId }));
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