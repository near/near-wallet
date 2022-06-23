import { KeyPair } from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import SetupRecoveryImplicitAccount from '../components/accounts/create/implicit_account/SetupRecoveryImplicitAccount';
import EnterVerificationCode from '../components/accounts/EnterVerificationCode';
import { Mixpanel } from '../mixpanel';
import { redirectTo, saveAccount } from '../redux/actions/account';
import { showCustomAlert } from '../redux/actions/status';
import { setReleaseNotesClosed } from '../utils/localStorage';
import { wallet, RELEASE_NOTES_MODAL_VERSION } from '../utils/wallet';

export function SetupRecoveryImplicitAccountWrapper() {
    const dispatch = useDispatch();

    const [showVerifyEmailCode, setShowVerifyEmailCode] = useState(false);
    const [email, setEmail] = useState('');
    const [implicitAccountId, setImplicitAccountId] = useState('');
    const [recoveryKeyPair, setRecoveryKeyPair] = useState();
    const [verifyingEmailCode, setVerifyingEmailCode] = useState(false);
    const [resendingEmailCode, setResendingEmailCode] = useState(false);
    const [seedPhrasePublicKey, setSeedPhrasePublicKey] = useState(null);
    const [isInitializingRecoveryLink, setIsInitializingRecoveryLink] = useState(false);

    useEffect(() => {
        setReleaseNotesClosed(RELEASE_NOTES_MODAL_VERSION);
    }, []);

    const handleInititalizeEmailRecoveryLink = async () => {
        const passPhrase = await wallet.initializeRecoveryMethodNewImplicitAccount({ kind: 'email', detail: email });
        const { publicKey, secretKey } = parseSeedPhrase(passPhrase);
        const recoveryKeyPair = KeyPair.fromString(secretKey);
        const implicitAccountId = Buffer.from(recoveryKeyPair.publicKey.data).toString('hex');

        setRecoveryKeyPair(recoveryKeyPair);
        setImplicitAccountId(implicitAccountId);
        setSeedPhrasePublicKey(publicKey);
    };

    if (!showVerifyEmailCode) {
        return (
            <SetupRecoveryImplicitAccount
                email={email}
                isInitializingRecoveryLink={isInitializingRecoveryLink}
                setEmail={(email) => setEmail(email)}
                onClickSecureMyAccount={async ({ recoveryOption }) => {
                    if (recoveryOption === 'phrase') {
                        dispatch(redirectTo('/setup-passphrase-new-account'));
                    } else if (recoveryOption === 'ledger') {
                        dispatch(redirectTo('/setup-ledger-new-account'));
                    } else if (recoveryOption === 'email') {
                        Mixpanel.track('SR Select email');
                        setIsInitializingRecoveryLink(true);
                        await handleInititalizeEmailRecoveryLink();
                        setIsInitializingRecoveryLink(false);
                        setShowVerifyEmailCode(true);
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
                    await wallet.validateSecurityCodeNewImplicitAccount(implicitAccountId, { kind: 'email', detail: email }, securityCode, seedPhrasePublicKey);
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

                try {
                    await wallet.importZeroBalanceAccount(implicitAccountId, recoveryKeyPair);
                    dispatch(redirectTo('/'));
                } catch (e) {
                    dispatch(showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.recoverAccountSeedPhrase.errorNotAbleToImportAccount',
                        errorMessage: e.message
                    }));
                }
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
