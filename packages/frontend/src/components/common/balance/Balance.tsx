import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../../redux/slices/tokenFiatValues';
import BalanceDisplay from './BalanceDisplay';

type BalanceProps = {
    totalAmount?: string;
    amount: string;
    showSymbolNEAR?: string | boolean;
    className?: string;
    showBalanceInNEAR?: boolean;
    showBalanceInUSD?: boolean;
    showAlmostEqualSignUSD?: boolean;
    showSignUSD?: boolean;
    showSymbolUSD?: boolean;
    'data-test-id'?: string;
};
const Balance = ({
    totalAmount,
    amount,
    showSymbolNEAR,
    className,
    showBalanceInNEAR,
    showBalanceInUSD,
    showAlmostEqualSignUSD,
    showSignUSD,
    showSymbolUSD,
    'data-test-id': testId,
}: BalanceProps) => {
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    return (
        <BalanceDisplay
            totalAmount={totalAmount}
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
        />
    );
};

export default Balance;
