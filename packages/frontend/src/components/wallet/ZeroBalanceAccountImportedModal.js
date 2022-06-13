import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import Modal from '../common/modal/Modal';

const Container = styled.div`
    &&&&& {
        padding: 15px 0 10px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        font-weight: 500;
        word-break: break-word;

        h3 {
            margin: 15px 0;
        }

        > button {
            margin-top: 25px;
            width: 100%;
        }
    }
`;

export function ZeroBalanceAccountImportedModal ({
    importMethod,
    onClose,
    accountId
 }) {
    return (
        <Modal
            id='zero-balance-account-imported-modal'
            isOpen={importMethod}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='account.recoverAccount.zeroBalance.success.title'/></h3>
                <p><Translate id={`account.recoverAccount.zeroBalance.success.${importMethod}`}/></p>
                {accountId}
                <p><Translate id='account.recoverAccount.zeroBalance.success.desc'/></p>
                <FormButton onClick={onClose}><Translate id='button.dismiss'/></FormButton>
            </Container>
        </Modal>
    );
};
