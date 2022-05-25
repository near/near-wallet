import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../../common/FormButton';
import LedgerImageCircle from '../../../../svg/LedgerImageCircle';

type ConnectProps = {
    connecting: boolean;
    connect: ()=>void;
    cancel: ()=>void;
}

const Connect = ({
    connecting,
    connect,
    cancel
}:ConnectProps) => (
    <>
        <div className='content'>
            <LedgerImageCircle color='#F6F3AC' />
            <h3 className='title'>
                <Translate id='connectLedger.modal.connect.header' />
            </h3>
            <p>
                <Translate id='connectLedger.modal.connect.one' />
            </p>
        </div>
        <div className='buttons'>
            <FormButton
                className='gray link'
                onClick={cancel}
            >
                <Translate id='button.cancel' />
            </FormButton>
            <FormButton
                onClick={connect}
                sending={connecting}
                sendingString='button.connecting'
            >
                <Translate id='button.connect' />
            </FormButton>
        </div>
    </>
);

export default Connect;
