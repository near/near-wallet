import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';

const NextStepModal = ({ nextStep, onClose }) => {
    return (
        <Modal
            id='next-step-modal'
            isOpen={nextStep}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <MobileActionSheet/>
            <h2>Remove existing recovery methods?</h2>
            <p>Before removing your existing recovery methods, make sure that you have recorded and securely stored your Ledger seed phrase.</p>
            <p className='color-red'>If you lose access to your seed phrase, NEAR Inc. will be unable to assist you in recovery of your account and its funds.</p>
            <FormButton>Confirm</FormButton>
            <button className='link' id='close-button'>Cancel</button>
        </Modal>
    );
}

export default NextStepModal;