import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import selectNEARAsTokenWithMetadata from '../../../../redux/selectors/crossStateSelectors/selectNEARAsTokenWithMetadata';
import {
    selectAllTokens,
    selectTokensWithBalance,
} from '../../../../redux/slices/swap';

export default function useTokens() {
    const NEARConfig = useSelector((state) =>
        selectNEARAsTokenWithMetadata(state, { includeNearContractName: true })
    );
    const allTokens = useSelector(selectAllTokens);
    const tokensWithBalance = useSelector(selectTokensWithBalance);

    const [tokensIn, listOfTokensIn] = useMemo(() => {
        const tokensIn = {
            [NEARConfig.contractName]: NEARConfig,
            ...tokensWithBalance,
        };

        return [tokensIn, Object.values(tokensIn)];
    }, [NEARConfig, tokensWithBalance]);

    const [tokensOut, listOfTokensOut] = useMemo(() => {
        const tokensOut = {
            [NEARConfig.contractName]: NEARConfig,
            ...allTokens,
        };

        return [tokensOut, Object.values(tokensOut)];
    }, [NEARConfig, allTokens]);

    return { tokensIn, listOfTokensIn, tokensOut, listOfTokensOut };
}
