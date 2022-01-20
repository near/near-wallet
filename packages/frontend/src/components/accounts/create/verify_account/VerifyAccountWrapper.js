import { getLocation } from 'connected-react-router';
import { PublicKey, KeyType } from 'near-api-js/lib/utils/key_pair';
import React, { useState, useEffect, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3-near';
import { useDispatch, useSelector } from 'react-redux';

import { Mixpanel } from '../../../../mixpanel';
import {
    redirectTo,
    sendIdentityVerificationMethodCode,
    checkAndHideLedgerModal
} from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { isMoonpayAvailable } from '../../../../utils/moonpay';
import { wallet } from '../../../../utils/wallet';
import EnterVerificationCode from '../../EnterVerificationCode';
import VerifyAccount from './VerifyAccount';

export function VerifyAccountWrapper() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const dispatch = useDispatch();

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');

    const [activeVerificationOption, setActiveVerificationOption] = useState('email');
    const [showEnterVerificationCode, setShowEnterVerificationCode] = useState(false);
    const [verifyingAndCreatingAccount, setVerifyingAndCreatingAccount] = useState(false);
    const [showOptionAlreadyUsedModal, setShowOptionAlreadyUsedModal] = useState(false);
    const [showFundWithCreditCardOption, setShowFundWithCreditCardOption] = useState(false);
    const [fundedAccountAvailable, setFundedAccountAvailable] = useState(false);

    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationNumber, setVerificationNumber] = useState('');

    const getIdentityKey = () => activeVerificationOption === 'email' ? verificationEmail : verificationNumber;

    useEffect(() => {
        const checkIfMoonPayIsAvailable = async () => {
            await Mixpanel.withTracking("CA Check Moonpay available",
                async () => {
                    const moonpayAvailable = await isMoonpayAvailable();
                    if (moonpayAvailable) {
                        setShowFundWithCreditCardOption(true);
                    }
                }
            );
        };
        checkIfMoonPayIsAvailable();
    }, []);

    useEffect(() => {
        const handleCheckFundedAccountAvailable = async () => {
            const fundedAccountAvailable = await wallet.checkFundedAccountAvailable();
            setFundedAccountAvailable(fundedAccountAvailable);
        };
        handleCheckFundedAccountAvailable();
    }, []);

    const handleSendIdentityVerificationMethodCode = async ({ kind, identityKey, recaptchaToken, recaptchaAction }) => {
        await dispatch(sendIdentityVerificationMethodCode({
            kind,
            identityKey,
            recaptchaToken,
            recaptchaAction
        }));
    };

    const handleReCaptchaVerify = useCallback(async (event) => {
        if (!executeRecaptcha) {
            console.error('Execute recaptcha not yet available');
            return;
        }

        return executeRecaptcha(event);
    }, [executeRecaptcha]);

    if (showEnterVerificationCode) {
        return (
            <EnterVerificationCode
                isNewAccount={true}
                option={activeVerificationOption}
                phoneNumber={verificationNumber}
                email={verificationEmail}
                onConfirm={async (verificationCode) => {
                    const recaptchaToken = await handleReCaptchaVerify('verifiedIdentityCreateFundedAccount');
                    if (!recaptchaToken) {
                        dispatch(showCustomAlert({
                            success: false,
                            messageCodeHeader: 'error',
                            errorMessage: 'Failed recaptcha validation.'
                        }));
                        return;
                    }

                    const publicKey = new PublicKey({
                        keyType: KeyType.ED25519,
                        data: Buffer.from(implicitAccountId, 'hex')
                    });
                    try {
                        setVerifyingAndCreatingAccount(true);
                        await wallet.createIdentityFundedAccount({
                            accountId,
                            kind: activeVerificationOption,
                            publicKey,
                            identityKey: getIdentityKey(),
                            verificationCode,
                            recoveryMethod,
                            recaptchaToken,
                            recaptchaAction: 'verifiedIdentityCreateFundedAccount'
                        });
                    } catch (e) {
                        if (e.code === 'identityVerificationCodeInvalid') {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.setupRecoveryMessageNewAccount.invalidCode',
                                errorMessage: e.message
                            }));
                        } else if (e.code === 'identityVerificationEmailProviderInvalid') {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.emailProviderInvalid',
                                domainName: e.domainName
                            }));
                        } else if (e.code === 'identityVerificationRecaptchaInvalid') {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode',
                                errorMessage: e.message
                            }));
                        } else if (e.code === 'NotEnoughBalance') {
                            dispatch(redirectTo(`/initial-deposit${location.search}`));
                        } else {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: `reduxActions.${e.code}`,
                                errorMessage: e.message
                            }));
                        }
                        setVerifyingAndCreatingAccount(false);
                        console.warn(e.code, e.message);
                    } finally {
                        if (recoveryMethod === 'ledger') {
                            // Needed since 'wallet.createIdentityFundedAccount'
                            // is called directly without a redux action
                            dispatch(checkAndHideLedgerModal());
                        }
                    }
                }}
                onResend={async () => {
                    const recaptchaToken = await handleReCaptchaVerify('verifiedIdentityCreateVerificationMethod');
                    if (!recaptchaToken) {
                        dispatch(showCustomAlert({
                            success: false,
                            messageCodeHeader: 'error',
                            errorMessage: 'Failed recaptcha validation.'
                        }));
                        return;
                    }
                    await handleSendIdentityVerificationMethodCode({
                        kind: activeVerificationOption,
                        identityKey: getIdentityKey(),
                        recaptchaToken,
                        recaptchaAction: 'verifiedIdentityCreateVerificationMethod'
                    });
                }}
                onGoBack={() => setShowEnterVerificationCode(false)}
                skipRecaptcha={true}
                verifyingCode={verifyingAndCreatingAccount}
                showRecaptchaDisclaimer={true}
            />
        );
    }

    return (
        <VerifyAccount
            activeVerificationOption={activeVerificationOption}
            setActiveVerificationOption={option => setActiveVerificationOption(option)}
            verificationEmail={verificationEmail}
            onChangeVerificationEmail={e => setVerificationEmail(e.target.value)}
            verificationNumber={verificationNumber}
            onChangeVerificationNumber={number => setVerificationNumber(number)}
            handleContinue={async () => {
                if (activeVerificationOption === 'email' || activeVerificationOption === 'phone') {
                    try {
                        const recaptchaToken = await handleReCaptchaVerify('verifiedIdentityCreateVerificationMethod');

                        await handleSendIdentityVerificationMethodCode({
                            kind: activeVerificationOption,
                            identityKey: getIdentityKey(),
                            recaptchaToken,
                            recaptchaAction: 'verifiedIdentityCreateVerificationMethod'
                        });
                        setShowEnterVerificationCode(true);
                    } catch (e) {
                        if (e.code === 'identityVerificationAlreadyClaimed') {
                            setShowOptionAlreadyUsedModal(true);
                        } else if (e.code === 'identityVerificationEmailProviderInvalid') {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.emailProviderInvalid',
                                domainName: e.domainName
                            }));
                        } else if (e.code === 'identityVerificationRecaptchaInvalid') {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode',
                                errorMessage: e.message
                            }));
                        } else {
                            dispatch(showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: e.code,
                                errorMessage: e.message
                            }));
                        }
                        console.warn(e.code, e.message);
                    }
                    return;
                }

                if (activeVerificationOption === 'creditCard') {
                    return dispatch(redirectTo(`/initial-deposit${location.search}&fundingMethod=creditCard`));
                }

                if (activeVerificationOption === 'existingAccount') {
                    return dispatch(redirectTo(`/fund-with-existing-account${location.search}`));
                }

                if (activeVerificationOption === 'manualDeposit') {
                    return dispatch(redirectTo(`/initial-deposit${location.search}`));
                }
            }}
            showOptionAlreadyUsedModal={showOptionAlreadyUsedModal}
            onCloseOptionAlreadyUsedModal={() => setShowOptionAlreadyUsedModal(false)}
            showFundWithCreditCardOption={showFundWithCreditCardOption}
            fundedAccountAvailable={fundedAccountAvailable}
        />
    );
}
