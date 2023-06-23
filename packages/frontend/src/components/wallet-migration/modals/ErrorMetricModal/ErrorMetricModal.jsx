import React from 'react';
import { Translate } from 'react-localize-redux';

import IconSecurityLock from '../../../../images/wallet-migration/IconSecurityLock';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';

const ErrorMetricModal = ({
    onClose,
}) => {

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconSecurityLock />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.errorMetrics.title' />
                </h3>
                <p><Translate id='walletMigration.errorMetrics.desc'/></p>
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

export default ErrorMetricModal;

