import React, {useCallback, useState} from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconSecurityLock from '../../../../images/wallet-migration/IconSecurityLock';
import ClickToCopy from '../../../common/ClickToCopy';
import { ButtonsContainer, StyledButton, MigrationModal, Container } from '../../CommonComponents';

const TextSelectDisplay = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 20px;

    background: #272729;
    border-radius: 8px;

    word-break: break-word;
    text-align: center;
`;

const MigrationSecret = ({
    showMigrationPrompt,
    showMigrateAccount,
    secretKey
}) => {
    const [shouldContinueDisabled, setContinueDisabled] = useState(true);

    const setContinueEnable = useCallback(() => {
        setContinueDisabled(false);
    }, []);

    return (
        <MigrationModal>
            <Container>
                <IconSecurityLock/>
                <h3 className='title'>
                    <Translate id='walletMigration.migrationSecret.title'/>
                </h3>
                <p><Translate id='walletMigration.migrationSecret.desc'/></p>
                <ClickToCopy
                    copy={secretKey}
                    onClick={setContinueEnable}>
                    <TextSelectDisplay>
                        {secretKey}
                    </TextSelectDisplay>
                </ClickToCopy>

                <ButtonsContainer>
                    <StyledButton
                        className='gray-blue'
                        onClick={showMigrationPrompt}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton
                        disabled={shouldContinueDisabled}
                        onClick={showMigrateAccount}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default MigrationSecret;

