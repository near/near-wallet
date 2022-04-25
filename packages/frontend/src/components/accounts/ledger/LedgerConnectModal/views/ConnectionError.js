import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../../common/FormButton';
import ErrorIcon from '../../../../svg/ErrorIcon';

const ConnectionError = ({
    connecting,
    connect,
    cancel
}) => (
    <>
        <div className='content error'>
            <ErrorIcon />
            <h3 className='title'>
                <Translate id='connectLedger.modal.error.header' />
            </h3>
            <p>
                <Translate id='connectLedger.modal.error.one' />
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
                <Translate id='button.retry' />
            </FormButton>
        </div>
    </>
);

export default ConnectionError;
