import { useSelector } from "react-redux";

import { selectAccountId } from "../redux/slices/account";
import { selectNEARAsTokenWithMetadata, selectTokensWithMetadataForAccountId } from "../redux/slices/tokens";

export const useFungibleTokensIncludingNEAR = function () {
    const nearAsToken = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    return [nearAsToken, ...fungibleTokens];
};
