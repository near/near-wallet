import { useSelector } from "react-redux";

import { selectAccountId } from "../redux/slices/account";
import { selectTokensFiatValueUSD } from "../redux/slices/tokenFiatValues";
import { selectNEARAsTokenWithMetadata, selectTokensWithMetadataForAccountId } from "../redux/slices/tokens";

export const useFungibleTokensIncludingNEAR = function () {
    const nearAsToken = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    const fungibleTokenPrices = useSelector(selectTokensFiatValueUSD);
    const fungibleTokensWithPrices = fungibleTokens.map(ft => ({
        ...ft,
        fiatValueMetadata: {...fungibleTokenPrices[ft.contractName]}
    }));

    return [nearAsToken, ...fungibleTokensWithPrices];
};
