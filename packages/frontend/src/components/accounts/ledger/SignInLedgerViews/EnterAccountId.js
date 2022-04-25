import React from 'react';
import { Translate } from 'react-localize-redux';

import AccountFormAccountId from '../../../accounts/AccountFormAccountId';
import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';

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
}) => {
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
