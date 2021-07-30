import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../reducers/tokenFiatValue';
import { formatNearAmount } from '../../utils/balance';

const NEARBalanceInUSD = ({
    amount,
    showAlmostEqualSign = true,
    showUSDSign = false,
    showUSDSymbol = true
}) => {
    const formattedNearAmount = amount && formatNearAmount(amount);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);
    const balanceInUSD = Number(formattedNearAmount) * nearTokenFiatValueUSD;
    const roundedBalanceInUSD = balanceInUSD && balanceInUSD.toFixed(2);

    const USDSymbol = 'USD';
    
    // TODO: Show 'Loading...' for USD amount too?

    if (roundedBalanceInUSD && roundedBalanceInUSD !== 0 && roundedBalanceInUSD !== isNaN) {
        return (
            <>
                {showAlmostEqualSign && <>&asymp; </>}
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