import { useSelector } from 'react-redux';

import useSortedTokens from '../../../../hooks/useSortedTokens';
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
    const sortedTokens = useSortedTokens(
        Object.values(tokensWithBalance)
    ).reduce((acc, token) => {
        acc[token.contractName] = token;

        return acc;
    }, {});

    const tokensIn = {
        [NEARConfig.contractName]: NEARConfig,
        ...sortedTokens,
    };

    const tokensOut = {
        [NEARConfig.contractName]: NEARConfig,
        ...allTokens,
    };

    return {
        tokensIn,
        listOfTokensIn: Object.values(tokensIn),
        tokensOut,
        listOfTokensOut: Object.values(tokensOut),
    };
}
