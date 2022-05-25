import React from 'react';
import { Translate } from 'react-localize-redux';

import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';

type SignInProps = { 
    txSigned: boolean;
    handleCancel: ()=> void;
}

const SignIn = ({ 
    txSigned,
    handleCancel
}:SignInProps) => {
    return !txSigned
        ? (
            <>
                <LedgerImageCircle />
                <h1><Translate id={'confirmLedgerModal.header.confirm'}/></h1>
                <Translate id='signInLedger.modal.confirmPublicKey'/>
                <FormButton
                    className='gray link'
                    onClick={handleCancel}
                >
                    <Translate id='button.cancel' />
                </FormButton>
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
