import { useMemo } from 'react';

import CONFIG from '../config';
import { formatTokenAmount } from '../utils/amounts';

const compareInDecreasingOrderByPrice = (t1, t2) => {
    // Set NEAR always in the first place
    if (t1.contractName === CONFIG.NEAR_ID) {
        return -1;
    }
    if (t2.contractName === CONFIG.NEAR_ID) {
        return 1;
    }

    const price1 = t1.fiatValueMetadata?.usd;
    const balance1 = formatTokenAmount(
        t1.balance,
        t1.onChainFTMetadata.decimals
    );
    const price2 = t2.fiatValueMetadata?.usd;
    const balance2 = formatTokenAmount(
        t2.balance,
        t2.onChainFTMetadata.decimals
    );

    if (typeof price1 !== 'number') {
        return 1;
    }

    if (typeof price2 !== 'number') {
        return -1;
    }

    return balance2 * price2 - balance1 * price1;
};

export default function useSortedTokens(
    tokens,
    comparisonCallback = compareInDecreasingOrderByPrice
) {
    return useMemo(() => {
        if (typeof comparisonCallback !== 'function') {
            return tokens;
        }

        if (Array.isArray(tokens) && tokens.length) {
            return [...tokens].sort(comparisonCallback);
        }

        return tokens;
    }, [tokens]);
}
