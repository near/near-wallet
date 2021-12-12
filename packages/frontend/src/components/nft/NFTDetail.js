import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import UserIconGrey from '../../images/UserIconGrey';
import BackArrowButton from '../common/BackArrowButton';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import SendIcon from '../svg/SendIcon';
import NFTTransferModal from './NFTTransferModal';

const StyledContainer = styled(Container)`
    .container {
        max-width: 429px;
        position: relative;

        img {
            width: 100%;
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

            font-weight: 500;
            font-size: 16px;
            line-height: 150%;
            display: flex;
            align-items: center;
            color: #272729;
        }
    }

    .owner {
        p {
            font-weight: 500;
            font-size: 12px;
            line-height: 150%;
            display: flex;
            align-items: center;
            letter-spacing: 0.115em;
            color: #A2A2A8;
        }

        .inner {
            height: 30px;          
            line-height: 30px; 
            display: flex;         
            align-items: center;

            span {
                font-weight: 500;
                font-size: 16px;
                line-height: 150%;
                display: flex;
                align-items: center;
                color: #272729;
            }
        }
    }

    &&& {
        .transfer-btn {
            width: 100%;
            margin-top: 56px;

            svg {
                margin-right: 10px;
            }
        }
    }

    .back-arrow-button {
        position: absolute;
        top: -12px;
        left: -78px;
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

export function NFTDetail({ nft, accountId, nearBalance, ownerId, history }) {
    const [transferNftDetail, setTransferNftDetail] = useState();

    return (
        <StyledContainer className='medium centered'>
          {
            nft && 
            <div className='container'>
                <BackArrowButton
                    onClick={() => history.goBack()}
                    className='back-btn'
                >
                </BackArrowButton>

                <img src={nft.metadata.mediaUrl} alt='NFT'/>
                <h1 className="title">{nft.metadata.title}</h1>
                <p className="desc">{nft.metadata.description}</p>

                <div className='owner'>
                    <p><Translate id='NFTDetail.owner'/></p>

                    <div className='inner'>
                        <UserIcon>
                            <UserIconGrey color='#9a9a9a' />
                        </UserIcon>
                        <span>
                            { ownerId }
                        </span>
                    </div>
                </div>

                {(ownerId === accountId) &&
                  <FormButton 
                    className='transfer-btn'
                    color='gray-gray' 
                    disabled={ownerId !== accountId || !nearBalance}
                    onClick={() => setTransferNftDetail(nft)}
                >
                    <SendIcon/>
                    <Translate id='NFTDetail.transfer'/>
                </FormButton>}
                {transferNftDetail &&
                    <NFTTransferModal
                        open={!!transferNftDetail}
                        onClose={() => setTransferNftDetail()}
                        nft={transferNftDetail}
                        accountId={accountId}>
                        nearBalance={ nearBalance }
                    </NFTTransferModal>
                }
            </div>
          }
        </StyledContainer>
    );
}
