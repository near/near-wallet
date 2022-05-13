import React from 'react';

import { getRoundedBalanceInFiat, formatWithCommas } from './helpers';


type BalanceDisplayUSDProps = {
    amount:string;
    showAlmostEqualSignUSD?: boolean;
    showSignUSD?:boolean;
    showSymbolUSD?:boolean;
    nearTokenFiatValueUSD: number;
    isNear?:boolean;
    decimals?:number;
    totalAmount: string;
}

const BalanceDisplayUSD = ({
    amount,
    showAlmostEqualSignUSD = true,
    showSignUSD = true,
    showSymbolUSD = true,
    nearTokenFiatValueUSD,
    isNear = false,
    decimals,
    totalAmount
}:BalanceDisplayUSDProps) => {

    const roundedBalanceInUSD = amount && nearTokenFiatValueUSD && getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD, isNear,
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
    } else if (+roundedBalanceInUSD === 0) {
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
