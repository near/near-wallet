import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';

import { selectAccountId } from '../../redux/slices/account';
import {
    selectHasFetchedAllTokensForAccountForContract,
    selectLoadingTokensForAccountForContract,
    actions as nftActions,
    selectOneContractMetadata
} from '../../redux/slices/nft';
import FormButton from '../common/FormButton';

const { fetchOwnedNFTsForContract } = nftActions;

const LoadMoreButtonWrapper = ({ contractName }) => {
    const dispatch = useDispatch();
    const accountId = useSelector((state) => selectAccountId(state));
    const contractMetadata = useSelector((state) => selectOneContractMetadata(state, { contractName }));

    const fetchingNFTs = useSelector((state) => selectLoadingTokensForAccountForContract(state, {
        accountId,
        contractName
    }));

    const hasFetchedAllTokensForContract = useSelector((state) => selectHasFetchedAllTokensForAccountForContract(state, {
        accountId,
        contractName
    }));

    return !hasFetchedAllTokensForContract &&
        <FormButton
            onClick={() => dispatch(fetchOwnedNFTsForContract({ accountId, contractName, contractMetadata }))}
            sending={fetchingNFTs === true}
            color='gray-gray'
            sendingString='button.loading'
        >
            <Translate id='NFTs.loadMore'/>
        </FormButton>;
};

export default LoadMoreButtonWrapper;
