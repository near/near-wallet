import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const InstructionsModal = ({ open, onClose }) => {
    return (
        <Modal
            id='instructions-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <MobileActionSheet/>
            <h2><Translate id='setupLedgerSteps.header'/></h2>
            <ol>
                <li><Translate id='setupLedgerSteps.one'/></li>
                <li><Translate id='setupLedgerSteps.two'/></li>
                <li><Translate id='setupLedgerSteps.three'/></li>
                <li><Translate id='setupLedgerSteps.four'/></li>
                <li><Translate id='setupLedgerSteps.five'/></li>
            </ol>
            <FormButton color='gray-white' id='close-button'>
                <Translate id='button.dismiss'/>
            </FormButton>
        </Modal>
    );
}

export default InstructionsModal;