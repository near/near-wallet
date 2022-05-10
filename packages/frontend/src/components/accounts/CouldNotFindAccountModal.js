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

        h3 {
            margin: 15px 0;
        }

        > button {
            margin-top: 25px;
            width: 100%;
        }
    }
`;

export function CouldNotFindAccountModal ({
    isOpen,
    onClickImport,
    onClose
 }) {
    return (
        <Modal
            id='could-not-find-account-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <h3><Translate id='recoverSeedPhrase.couldNotFindAccountModal.title'/></h3>
                <p><Translate id='recoverSeedPhrase.couldNotFindAccountModal.desc'/></p>
                <FormButton onClick={onClickImport}><Translate id='recoverSeedPhrase.couldNotFindAccountModal.buttonImport'/></FormButton>
                <FormButton className='link' onClick={onClose}><Translate id='button.cancel'/></FormButton>
            </Container>
        </Modal>
    );
};
