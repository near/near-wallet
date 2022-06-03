import { useSelector } from 'react-redux';

import { NEAR_TOKEN_ID, USN_CONTRACT } from '../config';
import selectNEARAsTokenWithMetadata from '../redux/selectors/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { selectActiveAccountId } from '../redux/slices/activeAccount';
import { selectTokensFiatValueUSD } from '../redux/slices/tokenFiatValues';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';
import compare from '../utils/compare';


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

    const sortingOrder = {
        [USN_CONTRACT]: 1,
        [NEAR_TOKEN_ID]: 2
    };
    fungibleTokensWithPrices.sort(compare({key: 'contractName', sortingOrder}));
    
    return [NEARAsTokenWithMetadata, ...fungibleTokensWithPrices];
};
