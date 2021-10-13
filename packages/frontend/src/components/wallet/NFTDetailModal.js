import React, { useState } from 'react';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import ArrowIcon from '../svg/ArrowIcon';
import NFTTransferModal from './NFTTransferModal';


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 30px 0;

    .container {
        align-items: left;
        width: 100% !important;
        max-width: 400px;
        position: relative;

        img {
            width: 100% !important;
            margin-bottom: 63px;
            max-width: 400px;
            filter: drop-shadow(0px 100px 80px rgba(0, 0, 0, 0.07)) drop-shadow(0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198)) drop-shadow(0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275)) drop-shadow(0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035)) drop-shadow(0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725)) drop-shadow(0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802));
        }

        h1, p {
            margin-bottom: 30px;
        }
    }

    #back-btn {
        position: absolute;
        left: -98px;
        width: 30px !important;
        height: 30px !important;

        @media screen and (max-width: 600px) {
            top: -50px;
            left: -14px;
        }
        
        svg {
            width: 100%;
            height: 100%;
        }
    }

    a {
        border: 2px solid #F5F5F3;
        border-radius: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 110px;
        margin: 10px 0;
        transition: 100ms;

        :hover {
            border-color: #8FCDFF;
            background-color: #F0F9FF;
        }

        img {
            max-height: 35px;
        }
    } 

    button {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }

        font-weight: bold !important;
        font-size: 16px !important;
        line-height: 150%;
    }

    .transfer-svg {
        margin-right: 12px !important;
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

export default function NFTDetailModal({ open, onClose, nft }) {
    console.log(nft);
    const metadata = nft.metadata;
    const [transferNftDetail, setTransferNftDetail] = useState();

    return (
        <Modal
            id='nft-detail-modal'
            isOpen={open}
            onClose={onClose}
            closeButton={false}
            modalSize='lg'
        >
            <StyledContainer className='small-centered'>
                <div className='container'>
                    <FormButton
                        id='back-btn'
                        color='link'
                        onClick={() => onClose()}>
                        <ArrowIcon color='#A2A2A8'/>
                    </FormButton>

                    <img src={metadata.media} alt='NFT'/>
                    <h1 className="title">{metadata.title}</h1>
                    <p className="desc">{metadata.description}</p>
                </div>

                <FormButton 
                    color='gray-blue' 
                    onClick={() => setTransferNftDetail(nft)}
                >
                  {arrowSVG()}
                  Transfer
                </FormButton>
                {transferNftDetail &&
                    <NFTTransferModal
                        open={!!transferNftDetail}
                        onClose={() => setTransferNftDetail()}
                        nft={transferNftDetail}>
                    </NFTTransferModal>
                }

            </StyledContainer>
        </Modal>
    );
}
