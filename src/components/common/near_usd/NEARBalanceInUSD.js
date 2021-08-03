import React from 'react';

import { getRoundedBalanceInFiat } from '../../../utils/amounts';

const NEARBalanceInUSD = ({
    amount,
    showAlmostEqualSign = true,
    showUSDSign = false,
    showUSDSymbol = true,
    nearTokenFiatValueUSD
}) => {

    const roundedBalanceInUSD = getRoundedBalanceInFiat(amount, nearTokenFiatValueUSD);
    const amountPrefix = roundedBalanceInUSD !== '< 0.01' ? '≈ ' : '';
    const USDSymbol = 'USD';

    if (roundedBalanceInUSD && roundedBalanceInUSD !== isNaN) {
        return (
            <>
                {showAlmostEqualSign && amountPrefix}
                {showUSDSign && <>$</>}
                {roundedBalanceInUSD}
                {showUSDSymbol && ` ${USDSymbol}`}
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

export default NEARBalanceInUSD;