import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import AlertRoundedIcon from '../../../svg/AlertRoundedIcon.js';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';
import { WALLET_MIGRATION_ERRORS } from '../../WalletMigration.jsx';


const InfoIcon = styled(AlertRoundedIcon)`
    &&& {
        height: 30px;
        width: 30px;
        padding: 0;
    }
`;

const getErrorTranslationId = (context) => {
    switch (context) {
        case WALLET_MIGRATION_ERRORS.RPC_DOWN:
            return 'walletMigration.errors.rpcDown';
            
        case WALLET_MIGRATION_ERRORS.ONLY_INVALID_ACCOUNT:
            return 'walletMigration.errors.onlyInvalidAccount';
            
        default:
            return null;
    }
};

const ErrorModal = ({
    onClose,
    context,
}) => {
    const translationId = getErrorTranslationId(context);
    if (!translationId) {
        onClose();
        return null;
    }

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <InfoIcon />
                </IconBackground>
                <h3 className='title'>
                    <Translate id={`${translationId}.title`} />
                </h3>
                <p><Translate id={`${translationId}.desc`}/></p>
                <ButtonsContainer vertical>
                    <StyledButton
                        onClick={onClose}
                        fullWidth
                    >
                        <Translate id='button.close' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default ErrorModal;

