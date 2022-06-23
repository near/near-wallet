import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    actions as ledgerActions,
    selectLedgerConnectionModalType,
    selectLedgerConnectionStatusLoading
 } from '../../../../redux/slices/ledger';
import Modal from '../../../common/modal/Modal';
import ModalThemeV2 from './css/ModalThemeV2';
import LedgerConnectionModal from './views/LedgerConnectionModal';

const {
    handleConnectLedger,
    setLedgerConnectionModalType
} = ledgerActions;

const LedgerConnectModal = () => {
    const dispatch = useDispatch();

    const modalType = useSelector(selectLedgerConnectionModalType);
    const connecting = useSelector(selectLedgerConnectionStatusLoading);

    const connect = () => dispatch(handleConnectLedger());
    const cancel = () => dispatch(setLedgerConnectionModalType({ type: undefined }));

    return modalType
        ? <Modal
            id='ledger-connect-modal'
            closeButton='desktop'
            onClose={cancel}
        >
            <ModalThemeV2 />
            <LedgerConnectionModal
                connecting={connecting}
                connect={connect}
                cancel={cancel}
                modalType={modalType}
            />
        </Modal>
        : null;
};

export default LedgerConnectModal;
