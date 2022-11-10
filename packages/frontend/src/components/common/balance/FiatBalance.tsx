import React, { FC } from 'react';

import { getRoundedBalanceInFiat, formatWithCommas } from './helpers';

const USDSymbol = 'USD';

type FiatBalanceProps = {
    amount: string,
    showAlmostEqualSignUSD?: boolean,
    showSymbolUSD?: boolean,
    showSignUSD?: boolean,
    nearTokenFiatValueUSD?: number,
    isNear?: boolean,
    decimals: number,
    totalAmount?: string
}

const FiatBalance: FC<FiatBalanceProps> = ({
    amount,
    showAlmostEqualSignUSD = false,
    showSymbolUSD = false,
    showSignUSD = true,
    nearTokenFiatValueUSD,
    isNear = false,
    decimals,
    totalAmount = ''
}) => {
    const roundedBalanceInUSD =
        amount &&
        nearTokenFiatValueUSD &&
        getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD, isNear, decimals);

    const roundedBalanceInUSDIsBelowThreshold = roundedBalanceInUSD === '< $0.01';

    if (roundedBalanceInUSD) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold && (
                    <>
                        {showAlmostEqualSignUSD && '≈ '}
                        {showSignUSD && '$'}
                    </>
                )}
                {totalAmount ? formatWithCommas(totalAmount) : formatWithCommas(roundedBalanceInUSD)}
                {showSymbolUSD && ` ${USDSymbol}`}
            </>
        );
    }

    if (typeof roundedBalanceInUSD === 'number' && roundedBalanceInUSD === 0) {
        return (
            <>
                {showSignUSD && '$'}0
            </>
        );
    }

    return (
        <>—</>
    );
};

export default FiatBalance;
