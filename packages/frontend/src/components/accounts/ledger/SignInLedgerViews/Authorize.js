import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../common/FormButton';
import LocalAlertBox from '../../../common/LocalAlertBox';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';
import LedgerHdPaths from '../LedgerHdPaths';

const Authorize = ({
    status,
    confirmedPath,
    setConfirmedPath,
    handleSignIn,
    signingIn,
    handleCancel
}) => {
    return (
        <>
            <LedgerImageCircle />
            <h1><Translate id='signInLedger.header' /></h1>
            <Translate id='signInLedger.one' />
            <br /><br />
            <LocalAlertBox localAlert={status.localAlert} />
            <LedgerHdPaths
                confirmedPath={confirmedPath}
                setConfirmedPath={setConfirmedPath}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={handleSignIn}
                    sending={signingIn}
                    sendingString='button.signingIn'
                >
                    <Translate id='button.authorize' />
                </FormButton>
                <FormButton
                    className='gray link'
                    onClick={handleCancel}
                    trackingId='IE-Ledger Click cancel button'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
        </>
    );
};

export default Authorize;
