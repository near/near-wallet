import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import UserIconGrey from '../../images/UserIconGrey';
import NonFungibleTokens from '../../services/NonFungibleTokens';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import ArrowIcon from '../svg/ArrowIcon';

const StyledContainer = styled(Container)`
`;

const UserIcon = styled.div`
    background-size: 21px;
    flex: 0 0 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f8f8f8;
    text-align: center;
    margin: 0 12px 0 0;
    
    svg {
        width: 26px;
        height: 26px;
        margin: 7px;
    }

    @media (min-width: 940px) {
        display: inline-block;
    }
`;

export function NFTDetail({ match, location, history }) {
    const contractId = match.params.contractId;
    const tokenId = match.params.tokenId;
    const [ nft, setNft ] = useState({});
    console.log('loading nft detail', contractId, tokenId);

    useEffect(() => {
        NonFungibleTokens.getToken(contractId, tokenId)
            .then(token => {
                console.log(token);
                setNft(token);
            });
    }, []);

    return (
        <StyledContainer className='small-centered'>
            <div className='container'>
                <FormButton
                    id='back-btn'
                    color='link'
                    onClick={() => history.goBack()}>
                    <ArrowIcon color='#A2A2A8'/>
                </FormButton>

                <img src={nft.media} alt='NFT'/>
                <h1 className="title">{nft.title}</h1>
                <p className="desc">{nft.description}</p>

                <div className='owner'>
                    <p><Translate id='NFTDetail.owner'/></p>

                    <div className='inner'>
                        <UserIcon>
                            <UserIconGrey color='#9a9a9a' />
                        </UserIcon>
                        <span>
                            { 'owner.near' }
                        </span>
                    </div>
                </div>
            </div>
        </StyledContainer>
    );
}
