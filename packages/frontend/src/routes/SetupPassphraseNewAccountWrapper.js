import React from 'react';
import { useDispatch } from 'react-redux';

import SetupPassphraseNewAccount from '../components/accounts/recovery_setup/new_account/SetupPassphraseNewAccount';
import { redirectTo } from '../redux/actions/account';
import { wallet } from '../utils/wallet';

export function SetupPassphraseNewAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupPassphraseNewAccount
            handleConfirmPassphrase={async ({
                implicitAccountId,
                recoveryKeyPair
            }) => {
                await wallet.saveImplicitAccountKeyPair({ implicitAccountId, recoveryKeyPair });
                dispatch(redirectTo(`/create-implicit-account?implicitAccountId=${implicitAccountId}&recoveryMethod=phrase`));
            }}
        />
    );
}