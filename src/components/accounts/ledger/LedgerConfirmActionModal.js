import React from 'react';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';

import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';

import LedgerImage from '../../svg/LedgerImage';
import { useSelectorActiveAccount } from '../../../redux/useSelector';

const LedgerConfirmActionModal = () => {
    const { modal, txSigned } = useSelectorActiveAccount(({ ledger }) => ledger)

    return (modal && modal.show)
        ? (
            <Modal
                id='ledger-confirm-action-modal'
                closeButton='desktop'
                onClose={() => {}}
            >
                <ModalTheme/>
                {!txSigned
                    ? (
                        <>
                            <h2>
                                <Translate id={'confirmLedgerModal.header.confirm'}/>
                            </h2>
                            <LedgerImage animate={true}/>
                            <p><Translate id={modal.textId}/></p>
                        </>
                    ) : (
                        <>
                            <h2 className={'dots'}>
                                <Translate id={'confirmLedgerModal.header.processing'}/>
                            </h2>
                            <LedgerImage animate={false}/>
                        </>
                    )
                }
            </Modal>
        )
        : null
}

export default LedgerConfirmActionModal;
