import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import ClickToCopy from '../../../common/ClickToCopy';
import CopyIcon from '../../../svg/CopyIcon';
import ImportIcon from '../../../svg/ImportIcon';
import { ButtonsContainer, StyledButton, MigrationModal, Container } from '../../CommonComponents';
import { download } from '../../utils';

const IconButton = styled(StyledButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    flex-direction: row;
    svg {
      margin: -5px 6px -4px 0 !important;
      height: 22px !important;
      width: 22px !important;
    }
`;

const ExportKeyModal = ({ accountId, secretKey, onClose, onContinue }) => {   

    return (
        <MigrationModal
            onClose={onClose}
            style={{ maxWidth: '359px' }}
        >
            <Container>
                <h3 className='title'>
                    <Translate  id='walletMigration.exportKey.title' />
                </h3>
                <p>
                    <Translate id='walletMigration.exportKey.desc'/>
                </p>

                <ButtonsContainer vertical>
                    <ClickToCopy copy={secretKey} className='copy'>
                        <IconButton color="blue" fullWidth>
                            <CopyIcon color='#FFFFFF' />
                            <Translate id='button.copy' />
                        </IconButton>
                    </ClickToCopy>
                    <IconButton className='gray-blue' onClick={() => download(`${accountId}.txt`, secretKey)} color='gray-blue' fullWidth>
                        <ImportIcon color='#0072CE' />
                        <Translate id='button.download' />
                    </IconButton>
                    <StyledButton onClick={onContinue} fullWidth color="white-blue">
                        <Translate id='button.dismiss' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </MigrationModal>
    );
};

export default ExportKeyModal;
