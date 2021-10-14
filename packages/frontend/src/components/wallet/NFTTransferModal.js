import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { checkAccountAvailable } from '../../redux/actions/account';
import { clearLocalAlert } from '../../redux/actions/status';
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
        margin-bottom: 16px;
    }

    .transfer-txt {
        margin-top: 16px;
    }

    .confirm-txt {
        margin-bottom: 4px !important; 
    }

    .confirm-img {
        width: 172px;
    }

    .confirm-nft-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        width: 385px;
        margin-top: 16px;

        background: #FFFFFF;
        box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
        border-radius: 8px;

        .from-box {
            width: 385px;
            height: 74px;
        }

        .to-box {
            width: 385px;
            height: 53px;
        }

        .confirm-txt {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 150%;
            /* identical to box height, or 21px */
            
            font-feature-settings: 'zero' on;
            
            /* gray/neutral/600 */
            
            color: #72727A;

            margin-left: 16px;
        }

        .confirm-id {
            position: absolute;
            right: 16px;
            font-family: Inter;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 150%;
            /* identical to box height, or 21px */

            text-align: right;
            font-feature-settings: 'zero' on;

            /* gray/neutral/800 */

            color: #272729;
        }
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

    .receiver-input {
      width: 100%;
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
    const [ viewType, setViewType ] = useState('transfer');
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);

    const dispatch = useDispatch();
    const { localAlert } = useSelector(({ status }) => status);

    return (
        <Modal
            id='nft-transfer-modal'
            isOpen={nft}
            onClose={onClose}
            closeButton='false'
            modalSize='md'
        >
            {viewType === 'transfer' &&
            <StyledContainer className='small-centered'>
                <img src={nft.metadata.media} alt='NFT'/>

                <h3>Transfer NFT</h3>
                <p className='transfer-txt'>Enter a recipient address, then proceed to confirm your transaction. </p>

                <div className='receiver-input'>
                    <ReceiverInputWithLabel
                        receiverId={receiverId}
                        handleChangeReceiverId={receiverId => setReceiverId(receiverId)}
                        checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
                        localAlert={localAlert}
                        clearLocalAlert={() => dispatch(clearLocalAlert())}
                        setAccountIdIsValid={setAccountIdIsValid}
                    />
                </div>

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
                        // disabled={!accountIdIsValid}
                        // onClick={() => sendNFT(nft, receiverId, () => setSuccess(true))}
                        onClick={() => setViewType('confirm')}
                    >
                        Next
                    </FormButton>
                </div>
            </StyledContainer>
            }

            {viewType === 'confirm' &&
                <StyledContainer className='small-centered'>
                    <p className='confirm-txt'>Confirm Transaction:</p>
                    <h3>Transfer NFT</h3>

                    <div className='confirm-nft-card'>
                        <div className='confirm-img'>
                            <img src={nft.metadata.media} alt='NFT'/>
                        </div>
                        <div className='from-box'>
                            <span className='confirm-txt'>From</span>
                            <span className='confirm-id'>a.near</span>
                        </div>
                        <div className='to-box'>
                            <span className='confirm-txt'>To</span>
                            <span className='confirm-id'>a.near</span>
                        </div>
                    </div>

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
                            // disabled={!accountIdIsValid}
                            // onClick={() => sendNFT(nft, receiverId, () => setSuccess(true))}
                            onClick={() => setViewType('success')}
                        >
                            Confirm 
                        </FormButton>
                    </div>
                </StyledContainer>
            }

            {viewType === 'success' &&
                <StyledContainer className='small-centered'>
                    Success
                </StyledContainer>
            }
        </Modal>
    );
}
