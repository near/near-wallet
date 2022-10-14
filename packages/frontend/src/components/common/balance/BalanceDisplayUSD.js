import React from 'react';

import { getRoundedBalanceInFiat, formatWithCommas } from './helpers';


const BalanceDisplayUSD = ({
    amount,
    showAlmostEqualSignUSD = false,
    showSymbolUSD = false,
    showSignUSD = true,
    nearTokenFiatValueUSD,
    isNear = false,
    decimals,
    totalAmount
}) => {
    const roundedBalanceInUSD = amount && nearTokenFiatValueUSD && getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD,isNear,
        decimals);
    const USDSymbol = 'USD';
    const roundedBalanceInUSDIsBelowThreshold = roundedBalanceInUSD === '< $0.01';

    if (roundedBalanceInUSD) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold && (
                    <>
                        {showAlmostEqualSignUSD && '≈ '}
                        {showSignUSD && <>$</>}
                    </>
                )}
                {totalAmount ? formatWithCommas(totalAmount) : formatWithCommas(roundedBalanceInUSD)}
                {showSymbolUSD && ` ${USDSymbol}`}
            </>
        );
    }

    if (roundedBalanceInUSD === 0) {
        return (
            <>
                {showSignUSD && <>$</>}0
            </>
        );
    }

    return (
        <>—</>
    );
};

export default BalanceDisplayUSD;
