import React from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

import { selectLedgerModal, selectLedgerTxSigned } from '../../../redux/slices/ledger';
import Modal from '../../common/modal/Modal';
import LedgerImage from '../../svg/LedgerImage';
import ModalTheme from './ModalTheme';

const LedgerConfirmActionModal = () => {
    const txSigned = useSelector(selectLedgerTxSigned);
    const modal = useSelector(selectLedgerModal);

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
                            <h2 className='title'>
                                <Translate id={'confirmLedgerModal.header.confirm'}/>
                            </h2>
                            <LedgerImage animate={true}/>
                            <p><Translate id={modal.textId}/></p>
                        </>
                    ) : (
                        <>
                            <h2 className='title dots'>
                                <Translate id={'confirmLedgerModal.header.processing'}/>
                            </h2>
                            <LedgerImage animate={false}/>
                        </>
                    )
                }
            </Modal>
        )
        : null;
};

export default LedgerConfirmActionModal;
