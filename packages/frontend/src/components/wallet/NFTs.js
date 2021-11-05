import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import NearCircleIcon from '../svg/NearCircleIcon.js';
import NFTBox from './NFTBox';
import NFTDetailModal from './NFTDetailModal';

const StyledContainer = styled.div`
    &&& {
        width: 100%;

        @media (max-width: 991px) {
            margin-bottom: 50px;
        }

        .nft-box {
            border-top: 1px solid #F0F0F1;

            :first-of-type {
                border-top: none;
            }
        }

        .empty-state {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            padding: 50px 20px;
            background-color: #F8F8F8;
            border-radius: 8px;

            @media (max-width: 991px) {
                margin-top: 15px;
            }

            @media (min-width: 992px) {
                margin: 15px 15px 50px 15px;
            }

            > div {
                color: #B4B4B4;
            }

            svg {
                margin-bottom: 30px;
            }

            button {
                width: 100%;
                margin: 25px auto 0 auto;
                border-color: #EFEFEF;
                background: #EFEFEF;
            }
        }
    }
`;

const NFTs = ({ tokens, accountId, history }) => {
    if (tokens.length) {
        const [nftDetail, setNftDetail] = useState();
        return (
            <StyledContainer>
                {tokens.filter(tokenDetails => tokenDetails.ownedTokensMetadata && tokenDetails.ownedTokensMetadata.length).map((tokenDetails) => (
                    <NFTBox
                        key={tokenDetails.contractName}
                        tokenDetails={Object.assign({ ownerId: accountId }, tokenDetails)}
                        setNftDetail={setNftDetail}
                        history={history}
                    />
                ))}
                {nftDetail &&
                  <NFTDetailModal
                    open={!!nftDetail}
                    onClose={() => setNftDetail()}
                    nft={nftDetail}
                    accountId={accountId}>

                  </NFTDetailModal>
                }
            </StyledContainer>
        );
    }
    
    return (
        <StyledContainer>
            <div className='empty-state'>
                <NearCircleIcon/>
                <div><Translate id='NFTs.emptyState' /></div>
                <FormButton color='gray-blue' linkTo='https://awesomenear.com/categories/nft/'>
                    <Translate id='exploreApps.exploreApps' />
                </FormButton>
            </div>
        </StyledContainer>
    );
};

export default NFTs;
