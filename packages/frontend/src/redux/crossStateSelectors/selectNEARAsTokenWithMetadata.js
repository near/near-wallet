import { createSelector } from 'reselect';

import { selectAvailableBalance } from '../slices/account';
import { selectNearTokenFiatValueUSD } from '../slices/tokenFiatValues';

export default createSelector(
    [selectAvailableBalance, selectNearTokenFiatValueUSD],
    (balanceAvailable, usd) => ({
        balance: balanceAvailable || '',
        onChainFTMetadata: { symbol: 'NEAR', decimals: 24 },
        coingeckoMetadata: { usd },
    })
);
