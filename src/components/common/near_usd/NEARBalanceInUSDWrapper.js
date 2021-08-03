import React from 'react';
import { useSelector } from 'react-redux';

import { selectNearTokenFiatValueUSD } from '../../../slices/tokenFiatValues';
import NEARBalanceInUSD from './NEARBalanceInUSD';

const NEARBalanceInUSDWrapper = ({
    amount,
    showAlmostEqualSign,
    showUSDSign,
    showUSDSymbol,
}) => {

    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    return (
        <NEARBalanceInUSD
            amount={amount}
            showAlmostEqualSign={showAlmostEqualSign}
            showUSDSign={showUSDSign}
            showUSDSymbol={showUSDSymbol}
            nearTokenFiatValueUSD={nearTokenFiatValueUSD}
        />
    );
};

export default NEARBalanceInUSDWrapper;