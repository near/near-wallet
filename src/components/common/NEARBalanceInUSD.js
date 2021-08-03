import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../slices/tokenFiatValues';
import { formatNearAmount } from '../../utils/balance';

export const getRoundedBalanceInUSD = (rawNearAmount) => {
    const formattedNearAmount = rawNearAmount && formatNearAmount(rawNearAmount);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const balanceInUSD = Number(formattedNearAmount) * nearTokenFiatValueUSD;
    const roundedBalanceInUSD = balanceInUSD && balanceInUSD.toFixed(2);
    if (roundedBalanceInUSD === '0.00' || formattedNearAmount === '< 0.00001') {
        return '< 0.01';
    }
    return roundedBalanceInUSD;
};

const NEARBalanceInUSD = ({
    amount,
    showAlmostEqualSign = true,
    showUSDSign = false,
    showUSDSymbol = true
}) => {

    const roundedBalanceInUSD = getRoundedBalanceInUSD(amount);
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