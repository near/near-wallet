import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { Textfit } from 'react-textfit';
import styled from 'styled-components';

import selectNEARAsTokenWithMetadata from '../../../redux/crossStateSelectors/selectNEARAsTokenWithMetadata';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import AlertTriangleIcon from '../../svg/AlertTriangleIcon';
import TokenAmount from '../../wallet/TokenAmount';
import TokenStakeRewards from './TokenStakeRewards';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background: #FAFAFA;

    h2 {
        font-size: 16px;
        font-weight: 500;
        color: #72727A !important;
        padding: 51px 8px 8px 8px;
    }

    .validator-box {
        width: 100%;
        max-width: 400px;

        .left {
            > div {
                :first-of-type {
                    max-width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: left;
                }
            }
        }
    }

    .amount {
        width: 100%;
        max-width: 400px;
    }

    .stake-amount {
        color: #111618;
        font-weight: 900;
        margin-top: 4px !important;
        font-size: 25px;

        .fiat-amount {
            font-size: 14px;
        }
    }

    .divider {
        width: 100%;
        border-top: 1px solid #F2F2F2;
        position: relative;
        margin: 50px 0px;

        div {
            background-color: #FAFAFA;
            padding: 0 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
        }
    }

    .action-buttons {
        width: 100%;
        display: flex;
        padding: 22px 11px 0px 11px;

        .action-button {
            flex: 1;
            margin: 18px 4px;
        }

        .gray {
            background: #F0F0F1;
            color: #0072CE;
            border-width: 0px;
        }
    }

    .token-whitelist-disclaimer {
        display: flex;
        width: 100%;
        margin-top: 15px;
        padding: 12px;
        font-size: 12px;
        font-weight: 500;
        text-align: left;
        color: #995200;
        background: #FFECD6;
        border-radius: 4px;
        > span {
            margin-left: 10px;
        }
    }
`;

const ClaimConfirmModal = ({ open, onClose, onConfirm, validator, loading, title, label, farm }) => {
    const NEARAsTokenWithMetadata = useSelector(selectNEARAsTokenWithMetadata);
    const { 
        onChainFTMetadata,
        fiatValueMetadata,
        balance,
        contractName,
        isWhiteListed
    } = farm;
    return (
        <Modal
            id='stake-confirm-modal'
            isOpen={open}
            onClose={onClose}
            modalClass='slim'
            modalSize='sm'
        >
            <Container>
                <h2><Translate id={title}/></h2>
                <Textfit mode='single' max={40} className='amount'>
                    <TokenAmount
                        token={{
                            balance, onChainFTMetadata, fiatValueMetadata
                        }}
                        className="stake-amount"
                        withSymbol={true}
                        showFiatAmount={false}
                    />
                </Textfit>
                {label && <div className='divider'><div><Translate id={label}/></div></div>}
                <TokenStakeRewards
                    earnedToken={{
                        onChainFTMetadata,
                        contractName,
                        balance,
                        fiatValueMetadata,
                    }}
                    stakedToken={{
                        ...NEARAsTokenWithMetadata,
                        balance: validator.staked,
                    }}
                />
                {!isWhiteListed ? (
                    <div style={{ padding: '0px 17px' }}>
                        <div className="token-whitelist-disclaimer">
                            <AlertTriangleIcon />
                            <span>
                                <Translate id="staking.validator.notWhitelistedTokenWarning" />
                            </span>
                        </div>
                    </div>
                ) : null}
                <div className='action-buttons'>
                    <FormButton disabled={loading} color='gray action-button' id='close-button'>
                        <Translate id='button.cancel'/>
                    </FormButton>
                    <FormButton 
                        disabled={loading}
                        sending={loading}
                        sendingString='staking.validator.claiming'
                        onClick={() => onConfirm(contractName)}
                        color='blue action-button'
                        data-test-id="confirmStakeOnModalButton"
                    >
                        <Translate id='button.confirm'/>
                    </FormButton>
                </div>
            </Container>
        </Modal>
    );
};

export default ClaimConfirmModal;
