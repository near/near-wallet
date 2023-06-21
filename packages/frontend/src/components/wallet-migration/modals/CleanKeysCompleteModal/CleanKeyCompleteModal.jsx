import React from 'react';
import { Translate } from 'react-localize-redux';

import IconKey from '../../../../images/wallet-migration/IconKey';
import { MigrationModal, Container, IconBackground } from '../../CommonComponents';

const CleanKeysCompleteModal = ({ onNext }) => {
    // move to next modal after 3 seconds
    setTimeout(() => onNext(), 3000);

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconKey />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.cleanKeysComplete.title' />
                </h3>
                <p><Translate id='walletMigration.cleanKeysComplete.desc' /></p>
            </Container>
        </MigrationModal>
    );
};

export default CleanKeysCompleteModal;

