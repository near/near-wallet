import React from 'react';
import { Translate } from 'react-localize-redux';

import AccountFormAccountId from '../../AccountFormAccountId';
import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';

type EnterAccountIdProps = {
    accountId:string;
    handleAdditionalAccountId: ()=> void;
    handleChange: (value: string)=> void;
    checkAccountAvailable, 
    localAlert:{
        show: string;
        messageCode: string;
        success: string;
    };
    mainLoader: boolean;
    clearLocalAlert: ()=> void;
    stateAccountId: string;
    loader: boolean;
    clearSignInWithLedgerModalState: ()=> void;
}

const EnterAccountId = ({
    handleAdditionalAccountId, 
    handleChange, 
    checkAccountAvailable, 
    localAlert, 
    mainLoader, 
    clearLocalAlert, 
    stateAccountId, 
    loader,
    clearSignInWithLedgerModalState
}:EnterAccountIdProps) => {
    return (
        <>
            <LedgerImageCircle />
            <h1><Translate id='enterAccountNameLedgerModal.header'/></h1>
            <Translate id='enterAccountNameLedgerModal.one'/>
            <br /><br />
            <AccountFormAccountId
                mainLoader={mainLoader}
                handleChange={handleChange}
                checkAvailability={checkAccountAvailable}
                localAlert={localAlert}
                autoFocus={true}
                clearLocalAlert={clearLocalAlert}
                stateAccountId={stateAccountId}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={handleAdditionalAccountId}
                    disabled={mainLoader || !localAlert?.success}
                    sending={loader}
                >
                    <Translate id='button.confirm'/>
                </FormButton>

                <FormButton
                    onClick={clearSignInWithLedgerModalState}
                    className='gray link'
                >
                    <Translate id='button.cancel'/>
                </FormButton>
            </div>
        </>
    );
};

export default EnterAccountId;
