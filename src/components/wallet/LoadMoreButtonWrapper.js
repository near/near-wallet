import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';

import { selectAccountId } from '../../reducers/account';
import { selectHasFetchedAllTokensForAccountForContract, selectLoadingTokensForAccountForContract, actions as nftActions } from '../../reducers/nft';
import FormButton from '../common/FormButton';

const { fetchNFTsByContractName } = nftActions;

const LoadMoreButtonWrapper = ({ contractName }) => {
    const dispatch = useDispatch();
    const accountId = useSelector(state => selectAccountId(state));
    const fetchingNFTs = useSelector(state => selectLoadingTokensForAccountForContract(state, { accountId, contractName }));
    const hasFetchedAllTokensForContract = useSelector(state => selectHasFetchedAllTokensForAccountForContract(state, { accountId, contractName }));

    return !hasFetchedAllTokensForContract &&
        <FormButton 
            onClick={() => dispatch(fetchNFTsByContractName({ accountId, contractName }))}
            sending={fetchingNFTs === true}
            color='gray-gray'
            sendingString='button.loading'
        >
            <Translate id='NFTs.loadMore'/>
        </FormButton>;
};

export default LoadMoreButtonWrapper;