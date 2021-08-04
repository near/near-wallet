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
    const USDSymbol = 'USD';
    const roundedBalanceInUSDIsBelowThreshold = roundedBalanceInUSD === '< $0.01';

    if (roundedBalanceInUSD) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold &&
                    <>
                        {showAlmostEqualSignUSD && '≈ '}
                        {showSignUSD && <>$</>}
                    </>
                }
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