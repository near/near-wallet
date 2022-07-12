import React, { useEffect, useState } from 'react';

import { getTotalBalanceFromFungibleTokensListUSD } from '../common/balance/helpers';

const AllTokensTotalBalanceUSD = ({
    allFungibleTokens
}) => {

    const [totalBalanceUSD, setTotalBalanceUSD] = useState(0);
    useEffect(() => {
        const totalBalanceUSD = getTotalBalanceFromFungibleTokensListUSD(allFungibleTokens);
        setTotalBalanceUSD(totalBalanceUSD);
    }, [allFungibleTokens]);

    const USDSymbol = 'USD';
    if (totalBalanceUSD > 0) {
        return (
            <>
                {`$${totalBalanceUSD} ${USDSymbol}`}
            </>
        );
    } else {
        return (
            <>
                — {USDSymbol}
            </>
        );
    }
};

export default AllTokensTotalBalanceUSD;
