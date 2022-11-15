import React from 'react';
import { Translate } from 'react-localize-redux';

import IconLogout from '../../../../images/wallet-migration/IconLogout';
import { MigrationModal, Container, IconBackground } from '../../CommonComponents';

const RedirectingModal = ({
    wallet,
    onNext,
}) => {
    // move to next modal after 10 seconds
    setTimeout(() => onNext(), 10000);

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconLogout />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.redirect.title' data={{ wallet }} />
                </h3>
                <p><Translate id='walletMigration.redirect.desc'/></p>
            </Container>
        </MigrationModal>
    );
};

export default RedirectingModal;

