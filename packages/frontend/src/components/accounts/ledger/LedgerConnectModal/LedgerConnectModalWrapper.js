import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    actions as ledgerActions,
    CONNECT_MODAL_TYPE,
    selectLedgerConnectionModalType,
    selectLedgerConnectionStatusLoading
 } from '../../../../redux/slices/ledger';
import Modal from '../../../common/modal/Modal';
import ModalThemeV2 from './css/ModalThemeV2';
import Connect from './views/Connect';
import ConnectionError from './views/ConnectionError';
import Disconnected from './views/Disconnected';

const {
    handleConnectLedger,
    setLedgerConnectionModalType
} = ledgerActions;

const LedgerConnectModal = () => {
    const dispatch = useDispatch();

    const modalType = useSelector(selectLedgerConnectionModalType);
    const connecting = useSelector(selectLedgerConnectionStatusLoading);

    const connect = () => dispatch(handleConnectLedger());
    const cancel = () => dispatch(setLedgerConnectionModalType({ type: false }));

    const getCurrentViewComponent = () => {
        switch (modalType) {
            case CONNECT_MODAL_TYPE.CONNECT:
                return <Connect
                    connecting={connecting}
                    connect={connect}
                    cancel={cancel}
                />;
            case CONNECT_MODAL_TYPE.CONNECTION_ERROR:
                return <ConnectionError
                    connecting={connecting}
                    connect={connect}
                    cancel={cancel}
                />;
            case CONNECT_MODAL_TYPE.DISCONNECTED:
                return <Disconnected
                    connecting={connecting}
                    connect={connect}
                    cancel={cancel}
                />;
            default:
                return null;
        }
    };
    
    return modalType
        ? <Modal
            id='ledger-connect-modal'
            closeButton='desktop'
            onClose={cancel}
        >
            <ModalThemeV2 />
            {getCurrentViewComponent(modalType)}
        </Modal>
        : null;
};

export default LedgerConnectModal;
