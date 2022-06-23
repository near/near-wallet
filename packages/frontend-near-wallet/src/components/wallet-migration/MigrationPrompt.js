import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconClose from '../../images/IconClose';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import { WALLET_MIGRATION_VIEWS } from './WalletMigration';

const StyledContainer = styled(Container)`
    max-width: 356px;
`;

const ContentContainer = styled.div`
    padding: 15px 0;
    text-align: center;
    max-width: 362px;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    .close-icon {
        position: absolute;
        height: 16px;
        width: 16px;
        right: 24px;
        top: 24px;
        cursor: pointer;
    }

    .logo {
        width: 100%;
        max-width: 200px;
    }

    .title{
        font-size: 20px;
        margin-top: 16px;
    }
`;


const ButtonsContainer = styled.div`
    padding: 24px 0;
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


const MigrationPromptModal = ({ onClose, handleSetActiveView, handleRedirectToBatchImport }) => {
    return (
        <StyledContainer>
            <ContentContainer>
                <IconClose className="close-icon" onClick={onClose}/>
                <h3 className='title'><Translate id='walletMigration.migrationPrompt.title'/></h3>
                <p><Translate id='walletMigration.migrationPrompt.desc'/></p>
            </ContentContainer>
           <ButtonsContainer>
                <StyledButton onClick={handleRedirectToBatchImport}>
                    <Translate id='walletMigration.migrationPrompt.transferAccountsBtn' />
                 </StyledButton>
                 <StyledButton className="link" onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET);}}>
                    <Translate id='walletMigration.migrationPrompt.useDifferentWallet' />
                 </StyledButton>
           </ButtonsContainer>
        </StyledContainer>
    );
};

export default MigrationPromptModal;
