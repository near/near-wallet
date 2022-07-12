import { createSelector } from 'reselect';

import { selectAvailableBalance } from '../../slices/account';
import { selectNearTokenFiatValueUSD } from '../../slices/tokenFiatValues';

export default createSelector(
    [selectAvailableBalance, selectNearTokenFiatValueUSD, (_, params) => params?.includeNearContractName],
    (balanceAvailable, usd, includeNearContractName) => ({
        balance: balanceAvailable || '',
        contractName: includeNearContractName ? 'NEAR' : undefined,
        onChainFTMetadata: { symbol: 'NEAR', decimals: 24 },
        fiatValueMetadata: { usd },
    })
);
