import React from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../../../common/FormButton';
import Modal from '../../../common/modal/Modal';
import AlertTriangleIcon from '../../../svg/AlertTriangleIcon';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 0;

    h2 {
        color: #24272a;
        margin-top: 30px;
    }

    .desc {
        color: #72727A;
        font-size: 16px;
        margin: 20px 0 40px 0;
        max-width: 400px;
        line-height: 150%;
    }

    .alert-triangle {
        background-color: #FEF2F2;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        > svg {
            min-width: 30px;
            min-height: 30px;
        }
    }

    > button {
        width: 100%;
    }
`;

export default ({ isOpen, onClose }) => {
    return (
        <Modal
            id='method-already-used-modal'
            isOpen={isOpen}
            onClose={onClose}
            modalSize='md'
        >
            <Container>
                <div className='alert-triangle'><AlertTriangleIcon color='#DC1F25' /></div>
                <h2><Translate id='verifyAccount.modal.title' /></h2>
                <div className='desc'><Translate id='verifyAccount.modal.desc' /></div>
                {/* FIX: Handle if it's phone or email */}
                <FormButton
                    onClick={onClose}
                >
                    <Translate id='button.gotIt' />
                </FormButton>
            </Container>
        </Modal>
    );
};