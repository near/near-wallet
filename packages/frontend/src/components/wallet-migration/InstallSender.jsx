import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import SenderLogo from '../../../src/images/sender-logo.png';
import IconClose from '../../images/IconClose';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from './WalletMigration';

const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    max-width: 362px;
    margin: 0 auto;

    .close-icon {
        position: absolute;
        height: 16px;
        width: 16px;
        right: 24px;
        top: 24px;
        cursor: pointer;
    }

    .logo-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      p {
        font-family: Inter;
        font-size: 18px;
        font-weight: 600;
        color: black;
      }
    }

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 28px 12px;
    }

    .title{
        font-weight: 800;
        font-size: 20px;
        margin-top: 60px;
    }
`;

const ButtonsContainer = styled.div`
    padding: 24px;
    text-align: center;
    width: 100% !important;
`;

const StyledButton = styled(FormButton)`
    width: 100%;
    margin: 0 !important;

    &:not(:first-child) {
        margin-top: 10px !important;
    }
`;

const InstallSender = ({ onClose, handleSetActiveView }) => {
    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={true}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '435px' }}
        >
            <Container>
                <IconClose className="close-icon" onClick={onClose}/>
                <div className="logo-view">
                    <img src={SenderLogo} alt="Sender Wallet Logo" />
                    <p>Sender Wallet</p>
                </div>
                <h3 className='title'>
                    <Translate id='walletMigration.installSender.title'/>
                </h3>
                <p>
                    <Translate id='walletMigration.installSender.desc'/>
                </p>
            </Container>

            <ButtonsContainer>
                <StyledButton
                    onClick={()=>{
                        window.open('https://chrome.google.com/webstore/detail/sender-wallet/epapihdplajcdnnkdeiahlgigofloibg?utm_source=chrome-ntp-icon');
                    }}>
                    <Translate id='walletMigration.installSender.installNow' />
                </StyledButton>
                <StyledButton className="link" onClick={()=>{
                    handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET);
                }}>
                    <Translate id='walletMigration.installSender.back' />
                </StyledButton>
            </ButtonsContainer>
        </Modal>
    );
};

export default InstallSender;
