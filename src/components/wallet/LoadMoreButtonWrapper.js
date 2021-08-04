import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import { selectAccountId } from '../../reducers/account';
import { selectNumberOfFetchedTokensForAccountForContract, selectLoadingTokensForAccountForContract, selectTokensListForAccountForContract } from '../../reducers/nft';
import { TOKENS_PER_PAGE } from '../../services/NonFungibleTokens';
import FormButton from '../common/FormButton';

const LoadMoreButtonWrapper = ({ 
    fetchMoreNFTs,
    contractName
}) => {
    const accountId = useSelector(state => selectAccountId(state));
    const NFTs = useSelector(state => selectTokensListForAccountForContract(state, { accountId, contractName }));
    const fetchingNFTs = useSelector(state => selectLoadingTokensForAccountForContract(state, { accountId, contractName }));
    const numberOfFetchedTokens = useSelector(state => selectNumberOfFetchedTokensForAccountForContract(state, { accountId, contractName }));

    const showLoadMoreNFTs = NFTs.length % TOKENS_PER_PAGE === 0 && numberOfFetchedTokens >= TOKENS_PER_PAGE;

    return showLoadMoreNFTs &&
        <FormButton 
            onClick={() => fetchMoreNFTs(contractName)}
            sending={fetchingNFTs === true}
            color='gray-gray'
        >
            <Translate id='NFTs.loadMore'/>
        </FormButton>;
};

export default LoadMoreButtonWrapper;