import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import IconCopy from '../../images/wallet-migration/IconCopy';
import IconSecurityLock from '../../images/wallet-migration/IconSecurityLock';
import copyText from '../../utils/copyText';
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

    .title{
        margin-top: 40px;
    }
`;

const PinViewer = styled.div`
    background: #E5E5E6;
    padding: 12px 24px;
    font-size: 40px;
    font-weight: 500;
    border-radius: 16px;
    margin-top: 40px;
    position: relative;

    svg {
        position: absolute;
        right: 24px;
        top: calc((100% - 16px) / 2);
        cursor: pointer;
    }
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


const GenerateMigrationPin = ({ handleSetActiveView, migrationPin }) => {
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);

    const handleCopyPin = () => {
        copyText(migrationPin);
        setSuccessSnackbar(true, () => {
            setTimeout(() => {
                setSuccessSnackbar(false);
            }, 3000);
        });
    };

    return (
        <Modal
            modalClass="slim"
            id='migration-modal'
            isOpen={true}
            disableClose={true}
            modalSize='md'
            style={{ maxWidth: '431px' }}
        >
            <Container>
                <IconSecurityLock/>
                <h3 className='title'><Translate id='walletMigration.generateMigrationPin.title'/></h3>
                <p><Translate id='walletMigration.generateMigrationPin.desc'/></p>
                <PinViewer>
                    {migrationPin}
                    <IconCopy onClick={handleCopyPin} />
                </PinViewer>
                {successSnackbar &&<p><Translate id='walletMigration.generateMigrationPin.pinCopySuccess'/></p> }

              
                <ButtonsContainer>
                    <StyledButton className="gray-blue" onClick={()=>{handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);}}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton onClick={()=>{}}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </Modal>
    );
};

export default GenerateMigrationPin;
