import React from 'react';
import { useDispatch } from 'react-redux';

import SetupPassphraseNewAccount from '../components/accounts/recovery_setup/new_account/SetupPassphraseNewAccount';
import { redirectTo } from '../redux/actions/account';
import { initiateSetupForZeroBalanceAccountPhrase } from '../redux/slices/account/createAccountThunks';

export function SetupPassphraseNewAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupPassphraseNewAccount
            handleConfirmPassphrase={async ({
                implicitAccountId,
                recoveryKeyPair
            }) => {
                await dispatch(initiateSetupForZeroBalanceAccountPhrase({
                    implicitAccountId,
                    recoveryKeyPair
                }));
                dispatch(redirectTo('/'));
            }}
        />
    );
}
