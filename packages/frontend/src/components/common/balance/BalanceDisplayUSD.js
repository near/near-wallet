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

<<<<<<< HEAD
    const roundedBalanceInUSD = getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD,isNear,
=======
    const roundedBalanceInUSD = amount && nearTokenFiatValueUSD && getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD,isNear,
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
        decimals);
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
