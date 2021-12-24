import React from 'react';

import Balance from '../../common/balance/Balance';
import TokenAmount from './TokenAmount';

const RawTokenAmount = ({
    symbol,
    amount,
    decimals,
    withSymbol = true,
    showFiatAmountForNonNearToken,
    testId,
}) => {
    if (symbol !== "NEAR") {
        return (
            <TokenAmount
                token={{ symbol, decimals, balance: amount }}
                withSymbol={withSymbol}
                showFiatAmount={showFiatAmountForNonNearToken}
                testId={testId}
            />
        );
    } else {
        return <Balance amount={amount} symbol={withSymbol ? 'near' : false}
            showBalanceInUSD={showFiatAmountForNonNearToken}
            data-test-id={testId}
        />;
    }
};

export default RawTokenAmount;