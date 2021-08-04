import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import { selectAccountId } from '../../reducers/account';
import { selectHasFetchedAllTokensForAccountForContract, selectLoadingTokensForAccountForContract } from '../../reducers/nft';
import FormButton from '../common/FormButton';

const LoadMoreButtonWrapper = ({ 
    fetchMoreNFTs,
    contractName
}) => {
    const accountId = useSelector(state => selectAccountId(state));
    const fetchingNFTs = useSelector(state => selectLoadingTokensForAccountForContract(state, { accountId, contractName }));
    const hasFetchedAllTokensForContract = useSelector(state => selectHasFetchedAllTokensForAccountForContract(state, { accountId, contractName }));

    return !hasFetchedAllTokensForContract &&
        <FormButton 
            onClick={() => fetchMoreNFTs(contractName)}
            sending={fetchingNFTs === true}
            color='gray-gray'
        >
            <Translate id='NFTs.loadMore'/>
        </FormButton>;
};

export default LoadMoreButtonWrapper;