import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../common/FormButton';
import Modal from '../../common/modal/Modal';
import ModalTheme from './ModalTheme';

const InstructionsModal = ({ open, onClose }) => {
    return (
        <Modal
            id='instructions-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <h2 className='title'><Translate id='setupLedgerSteps.header'/></h2>
            <ol>
                <li><Translate id='setupLedgerSteps.one'/></li>
                <li><Translate id='setupLedgerSteps.two'/></li>
                <li><Translate id='setupLedgerSteps.three'/></li>
            </ol>
            <FormButton color='gray-white' id='close-button' trackingId='Close Instructions Modal'>
                <Translate id='button.dismiss'/>
            </FormButton>
        </Modal>
    );
};

export default InstructionsModal;
