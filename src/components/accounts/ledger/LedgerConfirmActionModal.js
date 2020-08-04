import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';

import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
import FormButton from '../../common/FormButton';

import LedgerImage from '../../svg/LedgerImage';

const LedgerConfirmActionModal = () => {

    const ledger = useSelector(({ account }) => account.ledger)

    return (ledger && ledger.hasLedger && ledger.modal && ledger.modal.show)
        ? (
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
                <p><Translate id={ledger.modal.textId}/></p>
                    <Translate id='button.cancelOperation'/>
                </FormButton>
            </Modal>
        )
        : null
}

export default LedgerConfirmActionModal;
