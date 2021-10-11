import React, { useState } from 'react';
import styled from 'styled-components';

import NonFungibleTokens from '../../services/NonFungibleTokens';

import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import ReceiverInputWithLabel from '../send/components/ReceiverInputWithLabel';


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 30px 0;

    img {
        width: 100% !important;
        max-width: 386px;
        border-radius: 8px;
    }

    h3, p {
        margin-top: 16px;
    }

    h3 {
        font-family: Inter;
        font-style: normal;
        font-weight: 900;
        font-size: 20px;
        line-height: 130%;
        /* identical to box height, or 26px */

        text-align: center;

        color: #24272A;
    }

    p {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        /* or 21px */

        text-align: center;
        font-feature-settings: 'zero' on;

        /* gray/neutral/600 */

        color: #72727A;
    }

    .buttons {
        margin-top: 24px;
        margin-left: auto;
        margin-right: 0px;
    }

    .next-btn {
        margin-left: 44px !important;
    }

    button {
        width: 136px !important;
        height: 56px !important;
    }
`;

async function sendNFT (nft, receiverId, onSuccess) {
    console.log('sending nft', nft, receiverId);
    const { contractId, tokenId, ownerId } = nft;
    const res = await NonFungibleTokens.transfer({
        accountId: ownerId,
        contractId,
        tokenId,
        receiverId
    });

    console.log('sent nft');
    console.log(res);
    onSuccess();
}


export default function NFTTransferModal({ open, onClose, nft }) {
    const [ receiverId, setReceiverId ] = useState();
    const [ success, setSuccess ] = useState(false);

    return (
        <Modal
            id='nft-transfer-modal'
            isOpen={nft}
            onClose={onClose}
            closeButton='false'
            modalSize='md'
        >
            {!success &&
            <StyledContainer className='small-centered'>
                <img src={nft.metadata.media} alt='NFT'/>

                <h3>Transfer NFT</h3>
                <p>Enter a recipient address, then proceed to confirm your transaction. </p>

                <ReceiverInputWithLabel
                    receiverId={receiverId}
                    handleChangeReceiverId={receiverId => setReceiverId(receiverId)}
                />

                <div className='buttons'>
                    <FormButton
                        className='link'
                        type='button'
                        onClick={onClose}
                        color='gray'
                    >
                        Cancel 
                    </FormButton>
                    <FormButton
                        className='next-btn'
                        type='submit'
                        onClick={() => sendNFT(nft, receiverId, () => setSuccess(true))}
                    >
                        Next
                    </FormButton>
                </div>
            </StyledContainer>
            }
            {success &&
                <StyledContainer className='small-centered'>
                    Success
                </StyledContainer>
            }
        </Modal>
    );
}
