import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { EXPLORER_URL } from '../../config';
import { useFungibleTokensIncludingNEAR } from '../../hooks/fungibleTokensIncludingNEAR';
import { checkAccountAvailable } from '../../redux/actions/account';
import { clearLocalAlert, showCustomAlert } from '../../redux/actions/status';
import NonFungibleTokens, { NFT_TRANSFER_GAS } from '../../services/NonFungibleTokens';
import isMobile from '../../utils/isMobile';
import { formatNearAmount } from '../common/balance/helpers';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import ModalFooter from '../common/modal/ModalFooter';
import SafeTranslate from '../SafeTranslate';
import ReceiverInputWithLabel from '../send/components/ReceiverInputWithLabel';
import AvatarSuccessIcon from '../svg/AvatarSuccessIcon';
import EstimatedFees from '../transfer/EstimatedFees';


const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 0 0;

    #nft-transfer-modal {
        width: 400px;
    }

    img {
        width: 100% !important;
        max-width: 300px;
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

        width: 100%;
        margin-top: 16px;

        background: #FFFFFF;
        box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
        border-radius: 8px;

        .from-box {
            position: relative;
            width: 100%;
            height: 74px;
            border-top: 1px solid #F0F0F1;
        }

        .to-box {
            position: relative;
            width: 100%;
            height: 74px;
            border-top: 1px solid #F0F0F1;
        }

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

        margin-left: 16px !important;
    }


    .h-right {
        position: absolute;
        right: 16px;
        text-align: right;
    }

    .estimate-fee-card {
        display: flex;
        flex-direction: column;
        position: relative;

        width: 100%;
        height: 78px;
        margin-top: 16px;

        border: 1px solid #F0F0F1;
        box-sizing: border-box;
        border-radius: 8px;
    }

    .account-id {
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

    .success {
        > p {
            font-family: Inter;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
            line-height: 150%;
            /* or 30px */
            
            text-align: center;
            font-feature-settings: 'zero' on;
            
            /* gray/neutral/700 */
            
            color: #3F4045;

            margin-bottom: 0px;
        }
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

    .next-btn {
        margin-left: 44px !important;
    }

    .receiver-input {
      width: 100%;
    }

    .amount-grey {
        font-family: Inter;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        /* identical to box height, or 21px */

        font-feature-settings: 'zero' on;

        /* gray/neutral/500 */

        color: #A2A2A8;
    }

    .v-center {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
    }

    .icon {
        margin-bottom: 20px !important;
    }

    form {
        width: 100%;
    }

    .full-width {
        width: 100%;
    }


    .modal-footer {
        display: flex;
        align-items: right;
        justify-content: flex-end;
        // width: 100%;

        // margin: 0 -25px 0 -25px !important;

        button {
            width: 136px !important;
            height: 56px !important;

            margin-top: 0px !important;

            &.link {
                margin: 20px 35px;
            }
            
            &.blue {
                padding: 0 35px;
            }
        }
    }

    .success-bottons {
        align-items: center;
        margin-left: auto;
        margin-right: auto;

        > button {
            width: 185px !important;
        }
    }
`;

export default function NFTTransferModal({ open, onClose, nft, accountId, setOwnerId }) {
    const [ receiverId, setReceiverId ] = useState('');
    const [ result, setResult ] = useState();
    const [ sending, setSending ] = useState(false);
    const [ viewType, setViewType ] = useState('transfer');
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);
    const fungibleTokens = useFungibleTokensIncludingNEAR();
    const nearBalance = fungibleTokens[0].balance;
    const balanceToShow = formatNearAmount(nearBalance);
    const dispatch = useDispatch();

    const { localAlert } = useSelector(({ status }) => status);

    function onTransferSuccess(result, newOwnerId) {
        setResult(result);
        setOwnerId(newOwnerId);
        setViewType('success');
    }

    async function sendNFT (nft, receiverId) {
        setSending(true);
        try {
            const { contract_id, token_id, owner_id } = nft;
            const res = await NonFungibleTokens.transfer({
                accountId: owner_id,
                contractId: contract_id,
                tokenId: token_id,
                receiverId
            });

            onTransferSuccess(res, receiverId);
        } catch (err) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.sendNonFungibleToken.error',
                errorMessage: err.message,
            }));
        } finally {
            setSending(false);
        }
    }

    return (
        <Modal
            id='nft-transfer-modal'
            isOpen={nft}
            onClose={onClose}
            closeButton={false}
            modalSize='md'
        >
            {viewType === 'transfer' &&
            <StyledContainer className='small-centered'>
                <img className='transfer-img' src={nft.metadata.mediaUrl} alt='NFT'/>

                <h3><Translate id='NFTTransfer.transfer-nft'/></h3>
                <p className='transfer-txt'><Translate id='NFTTransfer.enter-receipt'/></p>

                <form>
                    <div className='receiver-input'>
                        <ReceiverInputWithLabel
                            receiverId={receiverId}
                            handleChangeReceiverId={receiverId => setReceiverId(receiverId)}
                            checkAccountAvailable={accountId => dispatch(checkAccountAvailable(accountId))}
                            localAlert={localAlert}
                            autoFocus={!isMobile()}
                            clearLocalAlert={() => dispatch(clearLocalAlert())}
                            setAccountIdIsValid={setAccountIdIsValid}
                        />
                    </div>

                    <ModalFooter>
                        <div className='buttons'>
                            <FormButton
                                className='link'
                                type='button'
                                onClick={onClose}
                                color='gray'
                            >
                            <Translate id='NFTTransfer.cancel'/>
                            </FormButton>
                            <FormButton
                                className='next-btn'
                                type='submit'
                                disabled={!accountIdIsValid}
                                onClick={() => setViewType('confirm')}
                            >
                            <Translate id='NFTTransfer.next'/>
                            </FormButton>
                        </div>
                    </ModalFooter>
                </form>
            </StyledContainer>
            }

            {viewType === 'confirm' &&
                <StyledContainer className='small-centered'>
                    <p className='confirm-txt'><Translate id='NFTTransfer.confirm-transaction'/></p>
                    <h3><Translate id='NFTTransfer.transfer-nft'/></h3>

                    <div className='confirm-nft-card'>
                        <div className='confirm-img'>
                            <img src={nft.metadata.mediaUrl} alt='NFT'/>
                        </div>

                        <div className='line'></div>
                        <div className='from-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.from'/></span>
                            <span className='h-right v-center'>
                                <span className='account-id'>{accountId}</span>
                                <div className='amount-grey'>{balanceToShow} NEAR</div>
                            </span>
                        </div>
                        <div className='line'></div>
                        <div className='to-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.to' /></span>
                            <span className='h-right v-center account-id'>{receiverId}</span>
                        </div>
                    </div>

                    <div className='estimate-fee-card'>
                        <EstimatedFees gasFeeAmount={NFT_TRANSFER_GAS}/>
                    </div>

                    <div className='full-width'>
                        <ModalFooter>
                            <div className='buttons'>
                                <FormButton
                                    className='link'
                                    type='button'
                                    onClick={onClose}
                                    color='gray'
                                >
                                    <Translate id='NFTTransfer.cancel'/>
                                </FormButton>
                                <FormButton
                                    className='next-btn'
                                    type='submit'
                                    sending={sending}
                                    onClick={() => sendNFT(nft, receiverId)}
                                >
                                    <Translate id='NFTTransfer.confirm'/>
                                </FormButton>
                            </div>
                        </ModalFooter>
                    </div>
                </StyledContainer>
            }

            {viewType === 'success' &&
                <StyledContainer className='small-centered'>
                    <div className='icon'>
                        <AvatarSuccessIcon/>
                    </div>
                    <div className='success'>
                        <p><Translate id='NFTTransfer.transaction-complete' /></p>
                        <p>
                        <SafeTranslate id='NFTTransfer.you-sent' 
                            data={{
                                title: nft.metadata.title,
                                receiverId
                            }}
                        />
                        </p>
                    </div>

                    <div className='full-width'>
                        <ModalFooter>
                            <div className='success-bottons'>
                                <FormButton
                                    type='button'
                                    linkTo={`${EXPLORER_URL}/transactions/${result.transaction.hash}`}
                                    color='gray-gray'
                                >
                                    <Translate id='NFTTransfer.view-receipt' />
                                </FormButton>
                                <FormButton
                                    className='next-btn'
                                    type='submit'
                                    onClick={onClose}
                                >
                                    <Translate id='NFTTransfer.continue' />
                                </FormButton>
                            </div>
                        </ModalFooter>
                    </div>
                </StyledContainer>
            }
        </Modal>
    );
}
