import { useSelector } from 'react-redux';

import selectNEARAsTokenWithMetadata from '../redux/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { selectAccountId } from '../redux/slices/account';
import { selectTokensFiatValueUSD } from '../redux/slices/tokenFiatValues';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';

export const useFungibleTokensIncludingNEAR = function () {
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    const fungibleTokenPrices = useSelector(selectTokensFiatValueUSD);
    const fungibleTokensWithPrices = fungibleTokens.map((ft) => ({
        ...ft,
        fiatValueMetadata: ft.fiatValueMetadata?.usd ? ft.fiatValueMetadata : {...fungibleTokenPrices[ft.contractName]}
    }));

    return [NEARAsTokenWithMetadata, ...fungibleTokensWithPrices];
};
