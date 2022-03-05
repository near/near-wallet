import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAccountId, selectBalance } from '../../redux/slices/account';
import {
    actions as nftActions,
    selectTokenForAccountForContractForTokenId,
    selectTransferredTokenForContractForTokenId,
} from '../../redux/slices/nft';
import { NFTDetail } from './NFTDetail';

export function NFTDetailWrapper ({
    match,
    history
}) {
    const { contractId: contractName, tokenId } = match.params;
    const accountId = useSelector(selectAccountId);
    const { balanceAvailable: nearBalance} = useSelector(selectBalance);
    const nft = useSelector((state) => selectTokenForAccountForContractForTokenId(state, {
        accountId,
        contractName,
        tokenId,
    }));

    const transferredNft = useSelector((state) => selectTransferredTokenForContractForTokenId(state, {
        contractName,
        tokenId,
    }));

    const dispatch = useDispatch();
    const { fetchNFT } = nftActions;

    useEffect(() => {
        if (accountId && !nft) {
            dispatch(fetchNFT({ accountId, contractName, tokenId }));
        }
    }, [accountId, contractName, nft]);

    return (
        <NFTDetail
            nft={(nft && { ...nft, contract_id: contractName }) || transferredNft}
            accountId={accountId}
            nearBalance={nearBalance}
            ownerId={nft?.owner_id || transferredNft?.owner_id}
            history={history}
        />
    );
}
