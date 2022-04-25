import React, { useEffect, useState } from 'react';
import { formatTokenAmount } from '../../utils/amounts';
import { formatWithCommas } from '../common/balance/helpers';

const BalanceDisplayUSD = ({
    tokens
}) => {
    const [balance, setBalance] = useState(0);
    useEffect(() => {
        const value = tokens.reduce((acc, cur) => {
            for (let i = 0; i < cur.length; i++) {
                const token = cur[i]
                const tokenBalance = formatTokenAmount(token.balance, token.onChainFTMetadata?.decimals, 5);
                if (token.fiatValueMetadata) {
                    acc += +(tokenBalance * token.fiatValueMetadata.usd)
                }
            }
            return !isNaN(acc) ? acc : 0
        }, 0).toFixed(2)
        setBalance(value)
    }, [tokens])

    const USDSymbol = 'USD';
    const roundedBalanceInUSDIsBelowThreshold = balance === '< $0.01';

    if (balance) {
        return (
            <>
                {!roundedBalanceInUSDIsBelowThreshold &&
                    <>
                        {<>$</>}
                    </>
                }
                {formatWithCommas(balance)}
                {` ${USDSymbol}`}
            </>
        );
    } else if (balance === 0) {
        return (
            <>
                {<>$</>}0
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

export default BalanceDisplayUSD;
