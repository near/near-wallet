import { useSelector } from 'react-redux';

import selectNEARAsTokenWithMetadata from '../redux/crossStateSelectors/selectNEARAsTokenWithMetadata';
import { selectAccountId } from '../redux/slices/account';
import { selectTokensWithMetadataForAccountId } from '../redux/slices/tokens';

export const useFungibleTokensIncludingNEAR = function () {
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);
    const accountId = useSelector(selectAccountId);
    const fungibleTokens = useSelector((state) =>
        selectTokensWithMetadataForAccountId(state, { accountId })
    );

    return [NEARAsTokenWithMetadata, ...fungibleTokens];
};
