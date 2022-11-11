import { QRCodeSVG } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { encryptAccountsData, generateCode } from '../../../utils/encoding';
import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import { getAccountsData } from '../WalletMigration';


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
        font-weight: 800;
        font-size: 20px;
        margin-top: 40px;
    }

    .qrcode-background {
        background-color: white;
        padding: 5px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
`;

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
    padding: 12px 24px 24px;
    border-top: 1px solid #EDEDED;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);

    &:last-child {
        margin-left: 16px !important;
    }
`;

const MigrationWithQrCode = ({ accounts, pinCode, onClose }) => {
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        const generateQrCode = async () => {
            const salt = generateCode(12);
            const accountsData = await getAccountsData(accounts);
            const encryptData = encryptAccountsData(accountsData, pinCode, salt);
            const obj = {
                website: 'https://sender.org/download',
                method: 'Pk',
                salt,
                keystore: encryptData,
                fromNearWallet: true,
            };
            setQrCode(JSON.stringify(obj));
        };
            
        generateQrCode();
    }, [pinCode, accounts]);

    return (
        <Modal
            modalClass='slim'
            id='migration-modal'
            isOpen
            disableClose
            onClose={onClose}
            modalSize='md'
            style={{ maxWidth: '496px' }}
        >
            <Container>
                <h4 className='title'><Translate id='walletMigration.senderMigrationWithQrCode.title'/></h4>
                <div className='qrcode-background'>
                    <QRCodeSVG value={qrCode} size={155} />
                </div>

                <ButtonsContainer>
                    <StyledButton className='gray-blue' onClick={onClose}>
                        <Translate id='button.cancel' />
                    </StyledButton>
                    <StyledButton onClick={onClose}>
                        <Translate id='button.continue' />
                    </StyledButton>
                </ButtonsContainer>
            </Container>
        </Modal>
    );
};

export default MigrationWithQrCode;
