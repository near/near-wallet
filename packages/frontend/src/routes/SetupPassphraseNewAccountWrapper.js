import React from 'react';
import { useDispatch } from 'react-redux';

import { IMPORT_ZERO_BALANCE_ACCOUNT } from '../../../../features';
import SetupPassphraseNewAccount from '../components/accounts/recovery_setup/new_account/SetupPassphraseNewAccount';
import { redirectTo } from '../redux/actions/account';
import { initiateSetupForZeroBalanceAccountPhrase } from '../redux/slices/account/createAccountThunks';
import { wallet } from '../utils/wallet';

export function SetupPassphraseNewAccountWrapper() {
    const dispatch = useDispatch();
    return (
        <SetupPassphraseNewAccount
            handleConfirmPassphrase={async ({
                implicitAccountId,
                recoveryKeyPair
            }) => {
                if (IMPORT_ZERO_BALANCE_ACCOUNT) {
                    await dispatch(initiateSetupForZeroBalanceAccountPhrase({
                        implicitAccountId,
                        recoveryKeyPair
                    }));
                    dispatch(redirectTo('/'));
                } else {
                    await wallet.saveAccountKeyPair({ accountId: implicitAccountId, recoveryKeyPair });
                    dispatch(redirectTo(`/create-implicit-account?implicitAccountId=${implicitAccountId}&recoveryMethod=phrase`));
                }
            }}
        />
    );
}
