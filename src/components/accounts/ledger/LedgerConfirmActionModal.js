import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerImage from '../../svg/LedgerImage';

const LedgerConfirmActionModal = ({ open, onClose, textId }) => {
    return (
        <Modal
            id='ledger-confirm-action-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <MobileActionSheet/>
            <h2><Translate id='confirmLedgerModal.header'/></h2>
            <LedgerImage animate={true}/>
            <p><Translate id={textId}/></p>
            <FormButton color='gray-red' id='close-button'>
                <Translate id='button.cancelOperation'/>
            </FormButton>
        </Modal>
    );
}

export default LedgerConfirmActionModal;
