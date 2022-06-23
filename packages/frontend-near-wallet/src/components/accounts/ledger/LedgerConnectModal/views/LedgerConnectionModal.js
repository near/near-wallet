import React from 'react';
import { Translate } from 'react-localize-redux';

import { CONNECT_MODAL_TYPE } from '../../../../../redux/slices/ledger';
import FormButton from '../../../../common/FormButton';
import ErrorIcon from '../../../../svg/ErrorIcon';
import LedgerImageCircle from '../../../../svg/LedgerImageCircle';

const LedgerConnectionModal = ({
    connecting,
    connect,
    cancel,
    modalType
}) => (
    <>
        <div className='content'>
            {modalType === CONNECT_MODAL_TYPE.CONNECT
                ? <LedgerImageCircle color='#F6F3AC' />
                : <div className='error'><ErrorIcon /></div>
            }
            <h3 className='title'>
                <Translate id={`connectLedger.modal.${modalType}.header`} />
            </h3>
            <p>
                <Translate id={`connectLedger.modal.${modalType}.connectionPrompt`} />
            </p>
        </div>
        <div className='buttons'>
            <FormButton
                className='gray link'
                onClick={cancel}
            >
                <Translate id={`connectLedger.modal.${modalType}.cancelButton`} />
            </FormButton>
            <FormButton
                onClick={connect}
                sending={connecting}
                sendingString='button.connecting'
            >
                <Translate id={`connectLedger.modal.${modalType}.connectButton`} />
            </FormButton>
        </div>
    </>
);

export default LedgerConnectionModal;
