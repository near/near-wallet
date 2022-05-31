import { useSelector } from 'react-redux';

import selectNEARAsTokenWithMetadata from '../redux/selectors/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { selectActiveAccountId } from '../redux/slices/activeAccount';
import { selectTokensFiatValueUSD } from '../redux/slices/tokenFiatValues';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';

export const useFungibleTokensIncludingNEAR = function ({ showTokensWithZeroBalance = false } = {}) {
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectActiveAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId, showTokensWithZeroBalance })
    );

    const fungibleTokenPrices = useSelector(selectTokensFiatValueUSD);
    const fungibleTokensWithPrices = fungibleTokens.map((ft) => ({
        ...ft,
        fiatValueMetadata: ft.fiatValueMetadata?.usd ? ft.fiatValueMetadata : {...fungibleTokenPrices[ft.contractName]}
    }));

    return [NEARAsTokenWithMetadata, ...fungibleTokensWithPrices];
};
