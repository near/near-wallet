import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from '../ledger/ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const EnableTwoFactorPromptModal = ({ open, onClose }) => {
    return (
        <Modal
            id='two-factor-prompt-modal'
            isOpen={open}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <MobileActionSheet/>
            <h2><Translate id='twoFactor.enable'/></h2>
            <p><Translate id='twoFactor.promptDesc'/></p>
            <FormButton>
                <Translate id='button.continueSetup'/>
            </FormButton>
            <button className='link color-red' id='close-button'><Translate id='button.skip'/></button>
        </Modal>
    );
}

export default EnableTwoFactorPromptModal;