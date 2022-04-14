import React from 'react';
import { Translate } from 'react-localize-redux';

import LedgerImageCircle from '../../../svg/LedgerImageCircle';

const SignIn = ({ 
    txSigned
}) => {
    return !txSigned
        ? (
            <>
                <LedgerImageCircle />
                <h1><Translate id={'confirmLedgerModal.header.confirm'}/></h1>
                <Translate id='signInLedger.modal.confirmPublicKey'/>
            </>        
        )
        : (
            <>
                <LedgerImageCircle />
                <h1 className={'dots'}><Translate id={'confirmLedgerModal.header.processing'}/></h1>
            </>
        );
};

export default SignIn;
