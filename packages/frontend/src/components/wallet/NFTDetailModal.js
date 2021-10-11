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

        img {
            width: 100% !important;
            margin-bottom: 83px;
            max-width: 400px;
            filter: drop-shadow(0px 100px 80px rgba(0, 0, 0, 0.07)) drop-shadow(0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198)) drop-shadow(0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275)) drop-shadow(0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035)) drop-shadow(0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725)) drop-shadow(0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802));
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
    }
`;


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
                        color='link go-back'
                        onClick={() => onClose()}>
                        <ArrowIcon />
                    </FormButton>

                    <img src={metadata.media} alt='NFT'/>
                    <h1 className="title">{metadata.title}</h1>
                    <p className="desc">{metadata.description}</p>
                </div>

                <FormButton 
                    color='gray-blue' 
                    onClick={() => setTransferNftDetail(nft)}
                >
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
