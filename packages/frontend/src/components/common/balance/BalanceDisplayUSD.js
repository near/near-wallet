import React from 'react';

import { getRoundedBalanceInFiat, formatWithCommas } from './helpers';


const BalanceDisplayUSD = ({
    amount,
    showAlmostEqualSignUSD = true,
    showSignUSD = true,
    showSymbolUSD = true,
    nearTokenFiatValueUSD,
    isNear = false,
    decimals,
    totalAmount
}) => {

    const roundedBalanceInUSD = amount && nearTokenFiatValueUSD && getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD,isNear,
        decimals);
    const USDSymbol = 'USD';
    const roundedBalanceInUSDIsBelowThreshold = roundedBalanceInUSD === '< $0.01';

    if (roundedBalanceInUSD || totalAmount) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold &&
                    <>
                        {showAlmostEqualSignUSD && '≈ '}
                        {showSignUSD && <>$</>}
                    </>
                }
                {totalAmount ? formatWithCommas(totalAmount) : formatWithCommas(roundedBalanceInUSD)}
                {showSymbolUSD && ` ${USDSymbol}`}
            </>
        );
    } else if (roundedBalanceInUSD === 0) {
        return (
            <>
                {showSignUSD && <>$</>}0
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
