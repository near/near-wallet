import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../slices/tokenFiatValues';
import { formatNearAmount } from '../../utils/balance';

export const getRoundedBalanceInUSD = (amount) => {
    const formattedNearAmount = amount && formatNearAmount(amount);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const balanceInUSD = Number(formattedNearAmount) * nearTokenFiatValueUSD;
    const roundedBalanceInUSD = balanceInUSD && balanceInUSD.toFixed(2);
    return roundedBalanceInUSD;
};

const getAmountPrefix = (amount) => {
    if (amount === '0.00') {
        // Less than sign
        return <>&lt;</>;
    } else {
        // Almost equal to sign
        return <>&asymp; </>;
    }
};

const NEARBalanceInUSD = ({
    amount,
    showAlmostEqualSign = true,
    showUSDSign = false,
    showUSDSymbol = true
}) => {

    const roundedBalanceInUSD = getRoundedBalanceInUSD(amount);
    const amountPrefix = getAmountPrefix(roundedBalanceInUSD);
    const USDSymbol = 'USD';

    if (roundedBalanceInUSD && roundedBalanceInUSD !== 0 && roundedBalanceInUSD !== isNaN) {
        return (
            <>
                {showAlmostEqualSign && amountPrefix}
                {showUSDSign && <>&#36;</>}
                {roundedBalanceInUSD}
                {showUSDSymbol && ` ${USDSymbol}`}
            </>
        );
    } else {
        return (
            <>
                &mdash; {USDSymbol}
            </>
        );
    }
};

export default NEARBalanceInUSD;