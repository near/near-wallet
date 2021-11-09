import React, { useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import UserIconGrey from '../../images/UserIconGrey';
import { selectAccountId } from '../../redux/slices/account';
import NonFungibleTokens from '../../services/NonFungibleTokens';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import ArrowIcon from '../svg/ArrowIcon';
import NFTTransferModal from './NFTTransferModal';

const StyledContainer = styled(Container)`
    .container {
        max-width: 429px;
        position: relative;

        img {
            max-width: 429px;
            margin-bottom: 83px;

            filter: drop-shadow(0px 100px 80px rgba(0, 0, 0, 0.07)) 
            drop-shadow(0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198)) 
            drop-shadow(0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275)) 
            drop-shadow(0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035)) 
            drop-shadow(0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725)) 
            drop-shadow(0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802));
        }

        .desc {
            margin-top: 48px;
            margin-bottom: 56px;

            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 150%;
            /* or 24px */

            display: flex;
            align-items: center;

            /* gray/neutral/800 */

            color: #272729;
        }
    }

    .owner {
        p {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 150%;
            /* identical to box height, or 18px */

            display: flex;
            align-items: center;
            letter-spacing: 0.115em;

            /* gray/neutral/500 */

            color: #A2A2A8;
        }

        .inner {
            height: 30px;          
            line-height: 30px; 
            display: flex;         
            align-items: center;

            span {
                font-family: Inter;
                font-style: normal;
                font-weight: 500;
                font-size: 16px;
                line-height: 150%;
                /* identical to box height, or 24px */

                display: flex;
                align-items: center;

                /* gray/neutral/800 */

                color: #272729;
            }
        }
    }

    .transfer-btn {
        width: 100%;
        margin-top: 56px !important;

        svg {
            margin-right: 10px !important;
        }
    }

    #back-btn {
        position: absolute;
        left: -98px;
        width: 30px !important;
        height: 30px !important;
        
        svg {
            width: 100%;
            height: 100%;
        }
    }

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

function arrowSVG () {
  return (
    <svg className="transfer-svg" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 1L14 21L10 12L1 8L21 1Z" stroke="#A2A2A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 1L10 12" stroke="#A2A2A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export function NFTDetail({ match, location, history }) {
    const accountId = useSelector(selectAccountId);

    const contractId = match.params.contractId;
    const tokenId = match.params.tokenId;
    const [ nft, setNft ] = useState();
    const [transferNftDetail, setTransferNftDetail] = useState();
    console.log('loading nft detail', contractId, tokenId);

    useEffect(() => {
        NonFungibleTokens.getToken(contractId, tokenId)
            .then(token => {
                console.log(token);
                setNft(token);
            });
    }, []);

    return (
        <StyledContainer className='medium centered'>
          {
            nft && 
            <div className='container'>
                <FormButton
                    id='back-btn'
                    color='link'
                    onClick={() => history.goBack()}>
                    <ArrowIcon color='#A2A2A8'/>
                </FormButton>

                <img src={nft.metadata.media} alt='NFT'/>
                <h1 className="title">{nft.metadata.title}</h1>
                <p className="desc">{nft.metadata.description}</p>

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

                <FormButton 
                    className='transfer-btn'
                    color='gray-black' 
                    disabled={nft.owner_id !== accountId}
                    onClick={() => setTransferNftDetail(nft)}
                >
                    {arrowSVG()}
                    <Translate id='NFTDetail.transfer'/>
                </FormButton>
                {transferNftDetail &&
                    <NFTTransferModal
                        open={!!transferNftDetail}
                        onClose={() => setTransferNftDetail()}
                        nft={transferNftDetail}
                        accountId={accountId}>
                    </NFTTransferModal>
                }
            </div>
          }
        </StyledContainer>
    );
}