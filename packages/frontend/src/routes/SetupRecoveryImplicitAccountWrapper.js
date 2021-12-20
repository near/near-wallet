import React from 'react';
import { useDispatch } from 'react-redux';

import SetupRecoveryImplicitAccount from '../components/accounts/create/implicit_account/SetupRecoveryImplicitAccount';
import { redirectTo } from '../redux/actions/account';

export function SetupRecoveryImplicitAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupRecoveryImplicitAccount
            onClickSecureMyAccount={({
                recoveryOption,
                email
            }) => {
                console.log('secure my account with:', recoveryOption);
                if (recoveryOption === 'phrase') {
                    dispatch(redirectTo(`/setup-passphrase-new-account`));
                    return;
                }
            }}
        />
    );
}