import React from 'react';

import Balance from '../../common/balance/Balance';
import TokenAmount from '../../wallet/TokenAmount';

const RawTokenAmount = ({
    symbol,
    amount,
    decimals,
    withSymbol = true,
    showFiatAmountForNonNearToken,
    showAmountAsSubtracted
}) => {
    if (decimals && symbol) {
        return (
            <TokenAmount 
                token={{ symbol, decimals, balance: amount }}
                withSymbol={withSymbol}
                showFiatAmount={showFiatAmountForNonNearToken}
            />
        );
    } else {
        return <Balance amount={amount} symbol={withSymbol ? 'near' : false} showAmountAsSubtracted={showAmountAsSubtracted}/>;
    }
};

export default RawTokenAmount;