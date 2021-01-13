import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';

const NextStepModal = ({ nextStep, onClose, onConfirm, removingkeys }) => {
    return (
        <Modal
            id='next-step-modal'
            isOpen={nextStep}
            onClose={onClose}
            closeButton='desktop'
        >
            <ModalTheme/>
            <h2><Translate id={`setupLedgerSuccess.nextStep.header.${nextStep}`}/></h2>
            <p><Translate id={`setupLedgerSuccess.nextStep.one.${nextStep}`}/></p>
            {nextStep === 'remove' && 
                <p className='color-red'><Translate id={`setupLedgerSuccess.nextStep.two.${nextStep}`}/></p>
            }
            <FormButton 
                onClick={onConfirm} 
                sending={removingkeys}
                disabled={removingkeys}
                sendingString='button.removingKeys'
            >
                <Translate id='button.confirm'/>
            </FormButton>
            <button className='link' id='close-button'><Translate id='button.cancel'/></button>
        </Modal>
    );
}

export default NextStepModal;