import React from 'react';

import Balance from '../../common/balance/Balance';
import TokenAmount from '../../wallet/TokenAmount';

const RawTokenAmount = ({
    symbol,
    amount,
    decimals = null,
    withSymbol = true,
    showFiatAmountForNonNearToken
}) => {
    if (decimals !== null && symbol) {
        return (
            <TokenAmount
                token={{
                    onChainFTMetadata: { symbol, decimals },
                    balance: amount
                }}
                withSymbol={withSymbol}
                showFiatAmount={showFiatAmountForNonNearToken}
            />
        );
    } else {
        return <Balance amount={amount} symbol={withSymbol ? 'near' : false}/>;
    }
};

export default RawTokenAmount;
