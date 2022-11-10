import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import SetupPassphraseNewAccount from '../components/accounts/recovery_setup/new_account/SetupPassphraseNewAccount';
import { redirectTo } from '../redux/actions/account';
import { initiateSetupForZeroBalanceAccountPhrase } from '../redux/slices/account/createAccountThunks';

const SetupPassphraseNewAccountWrapper = () => {
    const dispatch = useDispatch();

    const handleConfirmPassphrase = useCallback(async ({
        implicitAccountId,
        recoveryKeyPair
    }) => {
        await dispatch(initiateSetupForZeroBalanceAccountPhrase({
            implicitAccountId,
            recoveryKeyPair
        }));
        dispatch(redirectTo('/'));
    }, [dispatch]);

    return (
        <SetupPassphraseNewAccount
            onConfirmPassphrase={handleConfirmPassphrase}
        />
    );
};

export default SetupPassphraseNewAccountWrapper;
