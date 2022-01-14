import { useSelector } from "react-redux";

import { selectAccountId, selectBalance } from "../redux/slices/account";
import { selectNearTokenFiatValueUSD } from "../redux/slices/tokenFiatValues";
import { selectTokensWithMetadataForAccountId } from "../redux/slices/tokens";

const useNEARAsTokenWithMetadata = () => {
    const nearBalance = useSelector(selectBalance);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    return {
        balance: nearBalance?.balanceAvailable || "",
        onChainFTMetadata: { symbol: "NEAR" },
        coingeckoMetadata: { usd: nearTokenFiatValueUSD },
    };
};

export const useFungibleTokensIncludingNEAR = function () {
    const nearAsToken = useNEARAsTokenWithMetadata();
    const accountId = useSelector(selectAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    return [nearAsToken, ...fungibleTokens];
};
