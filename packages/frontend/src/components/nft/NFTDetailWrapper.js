import React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectAccountId, selectBalance } from "../../redux/slices/account";
import NonFungibleTokens from "../../services/NonFungibleTokens";
import { NFTDetail } from "./NFTDetail";

export function NFTDetailWrapper ({
    match,
    history
}) {
    const accountId = useSelector(selectAccountId);
    const balance = useSelector(state => selectBalance(state));
    const nearBalance = balance.balanceAvailable;

    const contractId = match.params.contractId;
    const tokenId = match.params.tokenId;
    const [ nft, setNft ] = useState();
    const [ ownerId, setOwnerId ] = useState();

    useEffect(() => {
        NonFungibleTokens.getMetadata(contractId).then(contractMetadata => {
            NonFungibleTokens.getToken(contractId, tokenId, contractMetadata.base_uri).then(token => {
                token.contract_id = contractId;
                setNft(token);
                setOwnerId(token.owner_id);
            });
        });
    }, []);

    return (
        <NFTDetail
            nft={nft}
            accountId={accountId}
            nearBalance={nearBalance}
            ownerId={ownerId}
            history={history}
        />
    );
}
