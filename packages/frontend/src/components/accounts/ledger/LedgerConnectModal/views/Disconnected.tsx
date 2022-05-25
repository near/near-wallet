import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../../common/FormButton';
import ErrorIcon from '../../../../svg/ErrorIcon';

type DisconnectedProps = {
    connecting: boolean;
    connect: ()=>void;
    cancel: ()=>void;
}

const Disconnected = ({
    connecting,
    connect,
    cancel
}:DisconnectedProps) => (
    <>
        <div className='content error'>
            <ErrorIcon />
            <h3 className='title'>
                <Translate id='connectLedger.modal.disconnected.header' />
            </h3>
            <p>
                <Translate id='connectLedger.modal.disconnected.one' />
            </p>
        </div>
        <div className='buttons'>
            <FormButton
                className='gray link'
                onClick={cancel}
            >
                <Translate id='button.dismiss' />
            </FormButton>
            <FormButton
                onClick={connect}
                sending={connecting}
                sendingString='button.connecting'
            >
                <Translate id='button.reconnect' />
            </FormButton>
        </div>
    </>
);

export default Disconnected;
