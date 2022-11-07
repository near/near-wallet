import React from 'react';
import { Translate } from 'react-localize-redux';

import IconLogout from '../../../../images/wallet-migration/IconLogout';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';


// Test cases
// - Ensure that if user leaves the flow and comes back in 
const YOCTO_NEAR_TO_REMOVE_FAK = 2;

const CleanKeysModal = ({ onNext, onClose }) => {
    console.log(YOCTO_NEAR_TO_REMOVE_FAK);
    // 1. Identify Full Access Keys on all user accounts. 
    // -Identify if they are sms, email, or unknown keys
    // 2. Ensure that the newly generated key in the RotateKeysModal is not deleted. 
    // 3. Ensure that the funding account has Threshold * (# of FAKs to be removed) Near present in their account. 
    // 4. Ensure that if an account has a single FAK OR is an Implicit Account with 0 Near, 
    // 5. Create a data structure which stores what keys should be marked for deletion
    // 6. For each account to be cleaned, show a modal where the user puts their FAK. 


    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconLogout />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.cleanKeys.title' />
                </h3>
                <p><Translate id='walletMigration.cleanKeys.desc'/></p>
                {/* TODO: write your logic here */}
                <ButtonsContainer vertical>
                    <StyledButton
                        onClick={onNext}
                        fullWidth
                    >
                        <Translate id='button.continue' />
                    </StyledButton>
                    <StyledButton className='gray-blue' onClick={onClose} fullWidth>
                        <Translate id='button.cancel' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};
// Ensure the user has the new FAK in their local storage and onchain and that they have exported their account. 

// Delete the old FAK on-chain and then from local storage.

export default CleanKeysModal;
