import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import NewAccountIdGraphic from '../common/graphics/NewAccountIdGraphic';
import Modal from '../common/modal/Modal';

const Container = styled.div`
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h3 {
        margin: 15px 0 5px 0;
    }

    > button {
        width: 100%;
    }
`;

export default ({ 
    accountId,
    isOpen,
    onClose
 }) => {
    return (
        <Modal
            id='near-drop-success-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='sm'
        >
            <Container>
                <NewAccountIdGraphic accountId={accountId}/>
                <h3><Translate id='account.createImplicit.success.modal.title'/></h3>
                <p><Translate id='account.createImplicit.success.modal.desc'/></p>
                <FormButton onClick={onClose}><Translate id='button.continue'/></FormButton>
            </Container>
        </Modal>
    );
};
