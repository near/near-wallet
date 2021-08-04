import React from 'react';

import { getRoundedBalanceInFiat } from './helpers';

const BalanceDisplayUSD = ({
    amount,
    showAlmostEqualSignUSD = true,
    showSignUSD = true,
    showSymbolUSD = true,
    nearTokenFiatValueUSD
}) => {

    const roundedBalanceInUSD = getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD);
    const amountPrefix = roundedBalanceInUSD !== '< 0.01' ? '≈ ' : '';
    const USDSymbol = 'USD';

    if (roundedBalanceInUSD && roundedBalanceInUSD !== isNaN) {
        return (
            <>
                {showAlmostEqualSignUSD && amountPrefix}
                {showSignUSD && <>$</>}
                {roundedBalanceInUSD}
                {showSymbolUSD && ` ${USDSymbol}`}
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

export default BalanceDisplayUSD;