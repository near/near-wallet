import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconSecurityLock from '../../images/wallet-migration/IconSecurityLock';
import ClickToCopy from '../common/ClickToCopy';
import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from './WalletMigration';


const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 56px 24px 24px;
    }

    .title {
        margin-top: 40px;
    }
`;

const TextSelectDisplay = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 20px;

    background: #272729;
    border-radius: 8px;

    word-break: break-word;
    text-align: left;
`;

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);
    margin: 48px 0 0 !important;

    &:last-child{
        margin-left: 16px !important;
    }
`;


const GenerateMigrationKey = ({ handleSetActiveView, secretKey, onMigrate }) => {
    return (
        <Modal
            modalClass='slim'
            id='migration-modal'
            isOpen={true}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '431px' }}
        >
            <Container>
                <IconSecurityLock/>
                <h3 className='title'><Translate id='walletMigration.generateMigrationKey.title'/></h3>
                <p><Translate id='walletMigration.generateMigrationKey.desc'/></p>
                <ClickToCopy copy={secretKey}>
                    <TextSelectDisplay>
                        {secretKey}
                    </TextSelectDisplay>
                </ClickToCopy>

                <ButtonsContainer>
                    <StyledButton className='gray-blue' onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);}}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);}}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </Modal>
    );
};

export default GenerateMigrationKey;

