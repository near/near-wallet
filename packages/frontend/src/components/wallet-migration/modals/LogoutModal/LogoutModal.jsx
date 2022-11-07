import React from 'react';
import { Translate } from 'react-localize-redux';

import IconLogout from '../../../../images/wallet-migration/IconLogout';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';

const LogoutModal = ({
    onLogout,
    onClose,
}) => {

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconLogout />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.logout.title' />
                </h3>
                <p><Translate id='walletMigration.logout.desc'/></p>
                <ButtonsContainer vertical>
                    <StyledButton
                        onClick={onLogout}
                        fullWidth
                    >
                        <Translate id='walletMigration.logout.button' />
                    </StyledButton>
                    <StyledButton className='gray-blue' onClick={onClose} fullWidth>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default LogoutModal;

