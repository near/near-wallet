import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../../redux/slices/tokenFiatValues';
import BalanceDisplay from './BalanceDisplay';

const Balance = ({
    amount,
    showSymbolNEAR,
    className,
    showBalanceInNEAR,
    showBalanceInUSD,
    showAlmostEqualSignUSD,
    showSignUSD,
    showSymbolUSD,
    "data-test-id": testId,
    isNear = true,
    tokenMeta = {}
}) => {
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    return (
        <BalanceDisplay
            amount={amount}
            showSymbolNEAR={showSymbolNEAR}
            className={className}
            showBalanceInNEAR={showBalanceInNEAR}
            showBalanceInUSD={showBalanceInUSD}
            nearTokenFiatValueUSD={nearTokenFiatValueUSD}
            showAlmostEqualSignUSD={showAlmostEqualSignUSD}
            showSignUSD={showSignUSD}
            showSymbolUSD={showSymbolUSD}
            data-test-id={testId}
            isNear={isNear}
            tokenMeta={tokenMeta}
        />
    );
};

export default Balance;