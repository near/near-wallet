import { useMemo } from "react";

export const useSplitFungibleTokens = (fungibleTokens, contractName) => {
    const mainTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
                    el.onChainFTMetadata.symbol === "NEAR" ||
                    el.onChainFTMetadata.symbol === contractName
            ),
        [fungibleTokens]
    );
    const othersTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
                    el.onChainFTMetadata.symbol !== "NEAR" &&
                    el.onChainFTMetadata.symbol !== contractName
            ),
        [fungibleTokens]
    );

    return [mainTokens, othersTokens];
};
