import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconMyNearWallet from '../../images/IconMyNearWallet';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from './WalletMigration';


const ContentContainer = styled.div`
    padding: 15px 0;
    text-align: center;
    max-width: 362px;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 24px;
    }

    svg{
    }

    .title{
        font-size: 20px;
        margin-top: 56px;
    }
`;

const StyledDivider = styled.hr`
    border-top: 1px solid #F0F0F1;
    margin: 0;
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


const MigrationPrompt = ({ onClose, handleSetActiveView }) => {
    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={true}
            onClose={onClose}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '496px' }}
        >
            <ContentContainer>
                <IconMyNearWallet />
                <h3 className='title'><Translate id='walletMigration.migrationPrompt.title'/></h3>
                <p><Translate id='walletMigration.migrationPrompt.desc'/></p>
            </ContentContainer>
            <StyledDivider />
           <ButtonsContainer>
                <StyledButton onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.GENERATE_MIGRATION_PIN);}}>
                    <Translate id='walletMigration.migrationPrompt.transferAccountsBtn' />
                 </StyledButton>
                 <StyledButton className="link" onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_WALLET);}}>
                    <Translate id='walletMigration.migrationPrompt.useDifferentWallet' />
                 </StyledButton>
           </ButtonsContainer>
        </Modal>
    );
};

export default MigrationPrompt;

