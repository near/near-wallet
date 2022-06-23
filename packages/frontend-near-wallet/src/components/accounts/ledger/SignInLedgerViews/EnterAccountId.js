import React from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { clearLocalAlert } from '../../../../redux/actions/status';
import { selectStatusSlice } from '../../../../redux/slices/status';
import AccountFormAccountId from '../../../accounts/AccountFormAccountId';
import FormButton from '../../../common/FormButton';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';

const EnterAccountId = ({
    handleAdditionalAccountId, 
    handleChange, 
    checkAccountAvailable, 
    mainLoader, 
    stateAccountId, 
    loader,
    clearSignInWithLedgerModalState
}) => {
    const dispatch = useDispatch();

    const status = useSelector(selectStatusSlice);

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
                localAlert={status.localAlert}
                autoFocus={true}
                clearLocalAlert={() => dispatch(clearLocalAlert())}
                stateAccountId={stateAccountId}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={handleAdditionalAccountId}
                    disabled={mainLoader || !status?.localAlert?.success}
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
