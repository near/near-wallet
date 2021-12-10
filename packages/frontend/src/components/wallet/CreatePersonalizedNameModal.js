import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import NewAccountIdGraphic from '../common/graphics/NewAccountIdGraphic';
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
                <h3><Translate id='account.createImplicitAccount.createPersonalizedNameModal.title'/></h3>
                <p><Translate id='account.createImplicitAccount.createPersonalizedNameModal.desc'/></p>
                <FormButton linkTo='/create'><Translate id='button.registerPersonalizedAccouunt'/></FormButton>
                <FormButton className='link' onClick={onClose}><Translate id='button.skipThisForNow'/></FormButton>
            </Container>
        </Modal>
    );
};