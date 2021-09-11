import { getLocation } from 'connected-react-router';
import { PublicKey, KeyType } from 'near-api-js/lib/utils/key_pair';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    redirectTo
} from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { isMoonpayAvailable } from '../../../../utils/moonpay';
import { wallet } from '../../../../utils/wallet';
import EnterVerificationCode from '../../EnterVerificationCode';
import VerifyAccount from './VerifyAccount';

export function VerifyAccountWrapper() {
    const dispatch = useDispatch();

    const location = useSelector(getLocation);
    const URLParams = new URLSearchParams(location.search);
    const accountId = URLParams.get('accountId');
    const implicitAccountId = URLParams.get('implicitAccountId');
    const recoveryMethod = URLParams.get('recoveryMethod');

    const [activeVerificationOption, setActiveVerificationOption] = useState('email');
    const [showEnterVerificationCode, setshowEnterVerificationCode] = useState(false);
    const [showOptionAlreadyUsedModal, setShowOptionAlreadyUsedModal] = useState(false);
    const [showFundWithCreditCardOption, setShowFundWithCreditCardOption] = useState(false);

    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationNumber, setVerificationNumber] = useState('');

    const identityKey = activeVerificationOption === 'email' ? verificationEmail : verificationNumber;

    useEffect(() => {
        const checkIfMoonPayIsAvailable = async () => {
            const moonpayAvailable = await isMoonpayAvailable();
            if (moonpayAvailable) {
                setShowFundWithCreditCardOption(true);
            }
        };
        checkIfMoonPayIsAvailable();
    }, []);

    const handleSendIdentityVerificationMethodCode = async () => {
        await wallet.sendIdentityVerificationMethodCode({
            kind: activeVerificationOption,
            identityKey
        });
    };

    if (showEnterVerificationCode) {
        return (
            <EnterVerificationCode
                isNewAccount={true}
                option={activeVerificationOption}
                phoneNumber={verificationNumber}
                email={verificationEmail}
                onConfirm={async (verificationCode) => {
                    const publicKey = new PublicKey({ 
                        keyType: KeyType.ED25519,
                        data: Buffer.from(implicitAccountId, 'hex')
                    });
                    try {
                        await wallet.createIdentifyFundedAccount({
                            accountId,
                            recoveryMethod,
                            publicKey,
                            identityKey,
                            verificationCode,
                            previousAccountId: undefined
                        });
                    } catch(e) {
                        console.log(e.code);
                    }
                    // FIX: Dispatch action to get error handling
                }}
                onResend={async () => {
                   await handleSendIdentityVerificationMethodCode();
                }}
                onGoBack={() => setshowEnterVerificationCode(false)}
                skipRecaptcha={true}
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
                        await handleSendIdentityVerificationMethodCode();
                        setshowEnterVerificationCode(true);
                    } catch(e) {
                        if (e.code === 'identityVerificationAlreadyClaimed') {
                            setShowOptionAlreadyUsedModal(true);
                        } else {
                            showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                errorMessage: e.code
                            });
                            throw e;
                        }
                    }
                    return;
                }
        
                if (activeVerificationOption === 'creditCard') {
                    return dispatch(redirectTo(`/initial-deposit${location.search}&fundingMethod=creditCard`));
                }
        
                if (activeVerificationOption === 'manualDeposit') {
                    return dispatch(redirectTo(`/initial-deposit${location.search}`));
                }
            }}
            showOptionAlreadyUsedModal={showOptionAlreadyUsedModal}
            onCloseOptionAlreadyUsedModal={() => setShowOptionAlreadyUsedModal(false)}
            showFundWithCreditCardOption={showFundWithCreditCardOption}
        />
    );
}