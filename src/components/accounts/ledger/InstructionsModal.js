import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';

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
            <h2>Install NEAR on your Ledger device</h2>
            <ol>
                <li>Open <span className='link'>Ledger Live</span> and navigate to your <span className='black'>Settings</span>.</li>
                <li>Under <span className='black'>Experimental Features</span>, make sure that <span className='black'>Developer Mode</span> is switched <span className='black'>on</span>.</li>
                <li>Return to the <span className='black'>Manager</span> tab and search for <span className='black'>NEAR</span>.</li>
                <li>Follow the instructions to install the <span className='black'>NEAR application</span> on your device.</li>
            </ol>
            <FormButton color='gray-white' id='close-button'>Dismiss</FormButton>
        </Modal>
    );
}

export default InstructionsModal;