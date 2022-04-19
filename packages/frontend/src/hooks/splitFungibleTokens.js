<<<<<<< HEAD
import { useMemo } from "react";
=======
import { useMemo } from 'react';
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872

export const useSplitFungibleTokens = (fungibleTokens, contractName) => {
    const mainTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
<<<<<<< HEAD
                    el.onChainFTMetadata.symbol === "NEAR" ||
=======
                    el.onChainFTMetadata.symbol === 'NEAR' ||
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                    el.onChainFTMetadata.symbol === contractName
            ),
        [fungibleTokens]
    );
    const othersTokens = useMemo(
        () =>
            fungibleTokens.filter(
                (el) =>
<<<<<<< HEAD
                    el.onChainFTMetadata.symbol !== "NEAR" &&
=======
                    el.onChainFTMetadata.symbol !== 'NEAR' &&
>>>>>>> 6db6616dc592adc17a0b06f3e365add52170a872
                    el.onChainFTMetadata.symbol !== contractName
            ),
        [fungibleTokens]
    );

    return [mainTokens, othersTokens];
};
