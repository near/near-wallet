import React from 'react';

import Balance from '../../common/balance/Balance';
import TokenAmount from '../../wallet/TokenAmount';

type RawTokenAmountProps = {
    symbol: string;
    amount: string;
    decimals: number;
    withSymbol?: boolean;
    showFiatAmountForNonNearToken: boolean;
};

const RawTokenAmount = ({
    symbol,
    amount,
    decimals,
    withSymbol = true,
    showFiatAmountForNonNearToken,
}: RawTokenAmountProps) => {
    if (decimals && symbol) {
        return (
            <TokenAmount
                //@ts-ignore
                token={{
                    onChainFTMetadata: { symbol, decimals },
                    balance: amount
                }}
                withSymbol={withSymbol}
                showFiatAmount={showFiatAmountForNonNearToken}
            />
        );
    } else {
        return <Balance amount={amount} showSymbolNEAR={withSymbol ? 'near' : false}/>;
    }
};

export default RawTokenAmount;
