import { KeyPair } from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import SetupRecoveryImplicitAccount from '../components/accounts/create/implicit_account/SetupRecoveryImplicitAccount';
import EnterVerificationCode from '../components/accounts/EnterVerificationCode';
import { Mixpanel } from '../mixpanel';
import { redirectTo, saveAccount } from '../redux/actions/account';
import { showCustomAlert } from '../redux/actions/status';
import { wallet } from '../utils/wallet';

export function SetupRecoveryImplicitAccountWrapper() {
    const dispatch = useDispatch();

    const [showVerifyEmailCode, setShowVerifyEmailCode] = useState(false);
    const [email, setEmail] = useState('');
    const [implicitAccountId, setImplicitAccountId] = useState('');
    const [recoveryKeyPair, setRecoveryKeyPair] = useState();
    const [verifyingEmailCode, setVerifyingEmailCode] = useState(false);
    const [resendingEmailCode, setResendingEmailCode] = useState(false);

    const handleInititalizeEmailRecoveryLink = async () => {
        const passPhrase = await wallet.initializeRecoveryMethodNewImplicitAccount({ kind: 'email', detail: email });
        const { secretKey } = parseSeedPhrase(passPhrase);
        const recoveryKeyPair = KeyPair.fromString(secretKey);
        const implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');

        setRecoveryKeyPair(recoveryKeyPair);
        setImplicitAccountId(implicitAccountId);
    };

    if (!showVerifyEmailCode) {
        return (
            <SetupRecoveryImplicitAccount
                email={email}
                setEmail={(email) => setEmail(email)}
                onClickSecureMyAccount={async ({ recoveryOption }) => {
                    if (recoveryOption === 'phrase') {
                        dispatch(redirectTo('/setup-passphrase-new-account'));
                    } else if (recoveryOption === 'ledger') {
                        dispatch(redirectTo('/setup-ledger-new-account'));
                    } else if (recoveryOption === 'email') {
                        Mixpanel.track('SR Select email');
                        setShowVerifyEmailCode(true);
                        handleInititalizeEmailRecoveryLink();
                    }
                }}
            />
        );
    }

    return (
        <EnterVerificationCode
            isNewAccount={true}
            skipRecaptcha={true}
            option='email'
            email={email}
            onConfirm={async (securityCode) => {
                Mixpanel.track('SR Verify email code');
                try {
                    setVerifyingEmailCode(true);
                    await wallet.validateSecurityCodeNewImplicitAccount(implicitAccountId, { kind: 'email', detail: email }, securityCode);
                    await dispatch(saveAccount(implicitAccountId, recoveryKeyPair));
                } catch (e) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'setupRecoveryMessageNewAccount.invalidCode',
                        errorMessage: e.message
                    }));
                    throw e;
                } finally {
                    setVerifyingEmailCode(false);
                }
                dispatch(redirectTo(`/create-implicit-account?implicitAccountId=${implicitAccountId}&recoveryMethod=email`));
            }}
            onGoBack={() => setShowVerifyEmailCode(false)}
            onResend={async () => {
                setResendingEmailCode(true);
                await handleInititalizeEmailRecoveryLink();
                setResendingEmailCode(false);
             }}
            reSending={resendingEmailCode}
            verifyingCode={verifyingEmailCode}
        />
    );
}
