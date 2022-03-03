import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectAccountId, selectBalance } from "../../redux/slices/account";
import {
    actions as nftActions,
    selectTokenForAccountForContractForTokenId,
} from '../../redux/slices/nft';
import { NFTDetail } from "./NFTDetail";

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

    const dispatch = useDispatch();
    const { fetchNFTs } = nftActions;

    useEffect(() => {
        if (accountId && !nft) {
            dispatch(fetchNFTs({ accountId, contractName }));
        }
    }, [accountId, contractName, nft]);

    return (
        <NFTDetail
            nft={nft && { ...nft, contract_id: contractName }}
            accountId={accountId}
            nearBalance={nearBalance}
            ownerId={nft?.owner_id}
            history={history}
        />
    );
}
