import React from 'react';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';

import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';

import LedgerImage from '../../svg/LedgerImage';

const LedgerConfirmActionModal = () => {
    const { modal, txSigned } = useSelector(({ ledger }) => ledger)

    return (modal && modal.show)
        ? (
            <Modal
                id='ledger-confirm-action-modal'
                closeButton='desktop'
            >
                <ModalTheme/>
                <MobileActionSheet/>
                <h2 className={txSigned ? 'dots' : ''}>
                    <Translate id={`confirmLedgerModal.header.${txSigned ? 'processing' : 'confirm'}`}/>
                </h2>
                <LedgerImage animate={!txSigned}/>
                {!txSigned && <p><Translate id={modal.textId}/></p>}
            </Modal>
        )
        : null
}

export default LedgerConfirmActionModal;
