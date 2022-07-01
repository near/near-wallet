import React, { useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { EXPLORER_URL, NFT_TRANSFER_GAS } from '../../config';
import { checkAccountAvailable } from '../../redux/actions/account';
import { clearLocalAlert, showCustomAlert } from '../../redux/actions/status';
import { selectBalance } from '../../redux/slices/account';
import { actions as ledgerActions } from '../../redux/slices/ledger';
import { actions as nftActions } from '../../redux/slices/nft';
import { selectStatusLocalAlert } from '../../redux/slices/status';
import NonFungibleTokens from '../../services/NonFungibleTokens';
import isMobile from '../../utils/isMobile';
import Balance from '../common/balance/Balance';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import ModalFooter from '../common/modal/ModalFooter';
import SafeTranslate from '../SafeTranslate';
import ReceiverInputWithLabel from '../send/components/ReceiverInputWithLabel';
import AvatarSuccessIcon from '../svg/AvatarSuccessIcon';
import EstimatedFees from '../transfer/EstimatedFees';

const StyledContainer = styled.div`
    &&& {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;

        img {
            width: 100%  ;
            border-radius: 8px;
            margin: 16px 0;
        }

        .transfer-txt {
            margin-top: 16px;
        }

        .confirm-txt {
            margin-bottom: 4px; 
        }

        .confirm-img {
            max-width: 272px;
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
            font-size: 14px;
            line-height: 150%;
            color: #72727A;
            margin-left: 16px;
        }


        .h-right {
            position: absolute;
            right: 16px;
            text-align: right;
        }

        .estimated-fees {
            width: 100%;
            margin-top: 20px;
        }

        .account-id {
            font-weight: bold;
            font-size: 14px;
            line-height: 150%;
            text-align: right;
            color: #272729;
        }

        h3 {
            font-weight: 900;
            font-size: 20px;
            line-height: 130%;
            text-align: center;
            color: #24272A;
        }

        .success {
            > p {
                font-weight: 500;
                font-size: 20px;
                line-height: 150%;
                text-align: center;
                color: #3F4045;
                margin-bottom: 0px;
            }
        }

        p {
            font-weight: 500;
            font-size: 14px;
            line-height: 150%;
            text-align: center;
            color: #72727A;
        }

        .next-btn {
            margin-left: 44px  ;
        }

        .receiver-input {
            width: 100%;
        }

        .amount-grey {
            font-weight: 500;
            font-size: 14px;
            line-height: 150%;
            color: #A2A2A8;
        }

        .v-center {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
        }

        .icon {
            margin-bottom: 20px  ;
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
            padding-top: 0px;
            padding-bottom: 0px;

            button {
                width: 136px;
                height: 56px;
                margin-top: 0px;

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
            margin-top: 25px;
            margin-bottom: 25px;
        }
    }
`;

export default function NFTTransferModal({ open, onClose, nft, accountId }) {
    const [ receiverId, setReceiverId ] = useState('');
    const [ result, setResult ] = useState();
    const [ sending, setSending ] = useState(false);
    const [ viewType, setViewType ] = useState('selectReceiver');
    const [ accountIdIsValid, setAccountIdIsValid] = useState(false);
    const { balanceAvailable: nearBalance } = useSelector(selectBalance);
    const dispatch = useDispatch();
    const { checkAndHideLedgerModal } = ledgerActions;
    const { transferToken } = nftActions;

    const localAlert = useSelector(selectStatusLocalAlert);

    async function sendNFT () {
        setSending(true);
        try {
            const { contract_id, token_id, owner_id } = nft;
            const res = await NonFungibleTokens.transfer({
                accountId: owner_id,
                contractId: contract_id,
                tokenId: token_id,
                receiverId
            });

            setResult(res);
            dispatch(transferToken({
                accountId,
                contractName: contract_id,
                nft: { ...nft, owner_id: receiverId },
            }));
            setViewType('success');
        } catch (err) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.sendNonFungibleToken.error',
                errorMessage: err.message,
            }));
        } finally {
            setSending(false);
            dispatch(checkAndHideLedgerModal());
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
            {viewType === 'selectReceiver' && (
                <StyledContainer>
                    <img className='transfer-img' src={nft.metadata.mediaUrl} alt='NFT'/>
    
                    <h3><Translate id='NFTTransfer.transferNft'/></h3>
                    <p className='transfer-txt'><Translate id='NFTTransfer.enterReceiver'/></p>
    
                    <form>
                        <div className='receiver-input'>
                            <ReceiverInputWithLabel
                                receiverId={receiverId}
                                handleChangeReceiverId={(receiverId) => setReceiverId(receiverId)}
                                checkAccountAvailable={(accountId) => dispatch(checkAccountAvailable(accountId))}
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
            )}

            {viewType === 'confirm' && (
                <StyledContainer>
                    <h3><Translate id='NFTTransfer.transferNft'/></h3>

                    <div className='confirm-nft-card'>
                        <div className='confirm-img'>
                            <img src={nft.metadata.mediaUrl} alt='NFT'/>
                        </div>

                        <div className='line'></div>
                        <div className='from-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.from'/></span>
                            <span className='h-right v-center'>
                                <span className='account-id'>{accountId}</span>
                                <Balance amount={nearBalance} showBalanceInUSD={false}/>
                            </span>
                        </div>
                        <div className='line'></div>
                        <div className='to-box'>
                            <span className='confirm-txt v-center'><Translate id='transfer.to' /></span>
                            <span className='h-right v-center account-id'>{receiverId}</span>
                        </div>
                    </div>

                    <EstimatedFees gasFeeAmount={NFT_TRANSFER_GAS}/>

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
            )}

            {viewType === 'success' && (
                <StyledContainer className='small-centered'>
                    <div className='icon'>
                        <AvatarSuccessIcon/>
                    </div>
                    <div className='success'>
                        <p><Translate id='NFTTransfer.transactionComplete' /></p>
                        <p>
                            <SafeTranslate id='NFTTransfer.youSent' 
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
                                    <Translate id='NFTTransfer.viewTransaction' />
                                </FormButton>
                                <FormButton
                                    className='next-btn'
                                    type='submit'
                                    linkTo='/?tab=collectibles'
                                >
                                    <Translate id='NFTTransfer.continue' />
                                </FormButton>
                            </div>
                        </ModalFooter>
                    </div>
                </StyledContainer>
            )}
        </Modal>
    );
}
