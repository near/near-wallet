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

    h2 {
        color: #72727A !important;
        font-size: 16px !important;
        font-weight: 400 !important;
        line-height: 150%;
        text-align: center;
        margin: 20px 0 30px 0;
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

    .title {
        position: static;
        width: 429px;
        left: 0px;
        top: 0px;
        
        /* heading/H1 */
        
        font-family: Inter;
        font-style: normal;
        font-weight: 900;
        font-size: 31px;
        line-height: 130%;
        /* or 40px */
        
        display: flex;
        align-items: center;
        font-feature-settings: 'zero' on;
        
        /* gray/neutral/800 */
        
        color: #272729;
    }

    .desc {
        position: static;
        width: 429px;
        left: 0px;
        top: 128px;

        /* paragraph/body/default */

        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 150%;
        /* or 24px */

        display: flex;
        align-items: center;
        font-feature-settings: 'zero' on;

        /* gray/neutral/800 */

        color: #272729;
    }

    .btn {
        &.gray-blue {
            width: 100% !important;
            max-width: 400px;
        }

        position: static;
        width: 136px;
        height: 56px;
        left: 274px;
        top: 24px;
        margin-left: 44px;
    }

    .btn {
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
                <ReceiverInputWithLabel
                    receiverId={receiverId}
                    handleChangeReceiverId={receiverId => setReceiverId(receiverId)}
                />

                <div>
                    <FormButton
                        className='btn link'
                        type='button'
                        onClick={onClose}
                        color='gray'
                    >
                        Cancel 
                    </FormButton>
                    <FormButton
                        className='btn'
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
