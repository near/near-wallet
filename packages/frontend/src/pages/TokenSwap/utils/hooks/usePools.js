import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
    selectAllPools,
    selectPoolsLoading,
    selectPoolsError,
} from '../../../../redux/slices/swap';
import fungibleTokenExchange from '../../../../services/tokenExchange';

const retrievePools = (allPools, keys) => {
    for (const key of keys) {
        const pools = allPools[key];

        if (pools && Object.keys(pools).length) {
            return pools;
        }
    }

    return null;
};

export default function usePools({ tokenIn, tokenOut }) {
    const allPools = useSelector(selectAllPools);
    const poolsLoading = useSelector(selectPoolsLoading);
    const poolsError = useSelector(selectPoolsError);

    const pools = useMemo(() => {
        if (tokenIn && tokenOut && !poolsLoading && !poolsError) {
            const tokenInId = fungibleTokenExchange.replaceNearIdIfNecessary(
                tokenIn?.contractName
            );
            const tokenOutId = fungibleTokenExchange.replaceNearIdIfNecessary(
                tokenOut?.contractName
            );

            // Extract pools related to current tokens by their store keys.
            // Keys are stored with only one order of token IDs, but
            // we do not know in which order they're in the form.
            // So here we try to find pools with all possible orders.
            return retrievePools(allPools, [
                JSON.stringify([tokenInId, tokenOutId]),
                JSON.stringify([tokenOutId, tokenInId]),
            ]);
        }

        return null;
    }, [tokenIn, tokenOut, poolsLoading, poolsError]);

    return { pools, poolsLoading, poolsError };
}
