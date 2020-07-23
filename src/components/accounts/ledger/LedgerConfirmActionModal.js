import React from 'react';
import Modal from "../../common/modal/Modal";
import ModalTheme from './ModalTheme';
import MobileActionSheet from '../../common/modal/MobileActionSheet';
// import FormButton from '../../common/FormButton';
import { Translate } from 'react-localize-redux';
import LedgerImage from '../../svg/LedgerImage';

const LedgerConfirmActionModal = ({ open, onClose, ledgerAccounts, gettingAccounts, addingAccounts }) => {
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
            {/* <p><Translate id='confirmLedgerModal.one'/></p> */}
            
            {gettingAccounts && (
                <h3>
                    Confirm public key
                </h3>
            )}
            {addingAccounts && (
                <div>
                    <h3>
                        Confirm the add key operation for each account:
                        {ledgerAccounts.map((account) => (
                            <div style={{ display: 'flex', paddingTop: '1rem', color: account.status === 'pending' ? '#999' : account.status === 'success' ? '#5ace84' : '' }}>
                                <div style={{ flex: '70%' }}>
                                    {account.accountId}
                                </div>
                                <div style={{ flex: '30%', textAlign: 'right' }}>
                                    {account.status}
                                </div>
                            </div>
                        ))}
                    </h3>
                </div>
            )}
            {/* <FormButton color='gray-red' id='close-button'>
                <Translate id='button.cancelOperation'/>
            </FormButton> */}
        </Modal>
    );
}

export default LedgerConfirmActionModal;
