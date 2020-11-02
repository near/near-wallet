import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';

import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import LedgerImage from '../../svg/LedgerImage';
import UserIconGrey from '../../../images/UserIconGrey';
import IconCheck from '../../../images/IconCheck'
import FormButton from '../../common/FormButton';
import AccountFormAccountId from '../../accounts/AccountFormAccountId'

const UserIcon = styled.div`
    background-size: 21px;
    width: 40px;
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
`

const H4 = styled.div`
    color: #999;
    text-align: center;
    padding: 30px 0 60px 0;
    font-size: 16px;
`

const AnimateList = styled.div`
    margin-top: 10px;
    height: 180px;
    overflow: hidden;

    & > div:first-of-type {
        margin-top: ${props => `-${props.animate * 60}px`};
        transition: 1s;
    }

    .row {
        border-top: 2px solid #f5f5f5;
        display: flex;
        height: 60px;
        align-items: center;

        &.success .status {
            text-align: right;
        }
        &.error .status {
            background: #ff898c;
            color: #cb2d30;
        }
        &.confirm .status {
            background: #6ad1e3;
            color: #14889d;
        }
        &.pending .status {
            background: #f4c898;
            color: #ae6816;
            text-align: left;
            padding: 0 0 0 10px;

            :after {
                content: '.';
                animation: dots 1s steps(5, end) infinite;
            
                @keyframes dots {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #ae6816;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #ae6816,
                            .6em 0 0 #ae6816;
                    }
                }
            }
        }
        &.waiting {
            .status {
                background: #f8f8f8;
                color: #aaaaaa;
            }
            > div:first-of-type {
                opacity: 0.4;
            }
            h3 {
                color: #aaaaaa !important;
            }
        }

        .status {
            width: 72px;
            margin-left: auto;
            height: 24px;
            border-radius: 12px;
            text-align: center;
            font-size: 12px;
            line-height: 24px;
        }
    }
`

const LedgerSignInModal = ({ 
    open, 
    onClose, 
    ledgerAccounts, 
    accountsApproved,
    accountsError,
    totalAccounts, 
    txSigned, 
    handleAdditionalAccountId, 
    signInWithLedgerStatus, 
    accountId, 
    handleChange, 
    checkAccountAvailable, 
    requestStatus, 
    setFormLoader, 
    formLoader, 
    clearRequestStatus, 
    stateAccountId, 
    loader,
    clearSignInWithLedgerModalState
}) => {
    
    const animationScope = Math.min(Math.max((accountsApproved + accountsError) - 1, 0), totalAccounts - 3)

    return (
        <Modal
            id='ledger-confirm-action-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
            modalSize='lg'
        >
            <ModalTheme/>
            <MobileActionSheet/>

            {signInWithLedgerStatus === 'confirm-public-key' && (!txSigned
                    ? (
                        <>
                            <h2>
                                <Translate id={'confirmLedgerModal.header.confirm'}/>
                            </h2>
                            <LedgerImage animate={true}/>
                            <div>
                                <H4><Translate id='signInLedger.modal.confirmPublicKey'/></H4>
                            </div>
                        </>        
                    )
                    : (
                        <>
                            <h2 className={'dots'}>
                                <Translate id={'confirmLedgerModal.header.processing'}/>
                            </h2>
                            <LedgerImage animate={false}/>
                        </>
                    )
            )}
            {signInWithLedgerStatus === 'enter-accountId' && (
                <>
                    <h2>
                        <Translate id='enterAccountNameLedgerModal.header'/>
                    </h2>
                    <LedgerImage animate={false}/>

                    <h4><Translate id='enterAccountNameLedgerModal.one'/></h4>
                    <AccountFormAccountId
                        formLoader={formLoader}
                        handleChange={handleChange}
                        checkAvailability={checkAccountAvailable}
                        requestStatus={requestStatus}
                        autoFocus={true}
                        setFormLoader={setFormLoader}
                        clearRequestStatus={clearRequestStatus}
                        stateAccountId={stateAccountId}
                    />


                    <FormButton
                        onClick={handleAdditionalAccountId}
                        disabled={formLoader || !requestStatus?.success}
                        sending={loader}
                    >
                        <Translate id='button.confirm'/>
                    </FormButton>

                    <FormButton
                        onClick={clearSignInWithLedgerModalState}
                        className='link'
                    >
                        <Translate id='button.cancel'/>
                    </FormButton>
                </>
            )}
            {signInWithLedgerStatus === 'confirm-accounts' && (
                <>
                    <h2 className={txSigned? 'dots' : ''}>
                        <Translate id={`confirmLedgerModal.header.${txSigned ? 'processing' : 'confirm'}`}/>
                    </h2>
                    <LedgerImage animate={txSigned ? false : true}/>

                    <div>
                        <H4>
                            <Translate id='signInLedger.modal.ledgerMustAdd'/>
                        </H4>
                        <div>
                            {accountsApproved}/{totalAccounts} <Translate id='signInLedger.modal.accountsApproved'/>
                        </div>
                        <AnimateList animate={animationScope}>
                            {ledgerAccounts.map((account) => (
                                <div key={account.accountId} className={`row ${account.status}`}>
                                    <UserIcon>
                                        <UserIconGrey color='#9a9a9a' />
                                    </UserIcon>
                                    <h3>
                                        {account.accountId}
                                    </h3>
                                    <div className='status'>
                                        {account.status !== 'success' 
                                            ? <Translate id={`signInLedger.modal.status.${account.status}`}/>
                                            : <IconCheck color='#5ace84' stroke='3px' />
                                        }
                                    </div>
                                </div>
                            ))}
                        </AnimateList>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default LedgerSignInModal;
