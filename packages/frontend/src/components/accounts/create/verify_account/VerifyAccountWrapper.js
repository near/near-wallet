import { getLocation } from 'connected-react-router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    redirectTo
} from '../../../../redux/actions/account';
import { isMoonpayAvailable } from '../../../../utils/moonpay';
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
    const [showEnterVerificatinCode, setShowEnterVerificatinCode] = useState(false);
    const [showOptionAlreadyUsedModal, setShowOptionAlreadyUsedModal] = useState(false);
    const [showFundWithCreditCardOption, setShowFundWithCreditCardOption] = useState(true);

    const [verificationEmail, setVerificationEmail] = useState('');
    const [verificationNumber, setVerificationNumber] = useState('');

    useEffect(() => {
        const checkIfMoonPayIsAvailable = async () => {
            const moonpayAvailable = await isMoonpayAvailable();
            if (moonpayAvailable) {
                setShowFundWithCreditCardOption(true);
            }
        };
        //checkIfMoonPayIsAvailable();
    }, []);

    const handleContinue = () => {

        if (activeVerificationOption === 'email') {
            return console.log('FIX: Send verification code to email');
        }

        if (activeVerificationOption === 'phone') {
            return console.log('FIX: Send verification code to phone');
        }

        if (activeVerificationOption === 'creditCard') {
            return dispatch(redirectTo(`/initial-deposit${location.search}&fundingMethod=creditCard`));
        }

        if (activeVerificationOption === 'manualDeposit') {
            return dispatch(redirectTo(`/initial-deposit${location.search}`));
        }
    };

    if (showEnterVerificatinCode) {
        return (
            <EnterVerificationCode
                isNewAccount={true}
                option={activeVerificationOption}
                phoneNumber={verificationNumber}
                email={verificationEmail}
                onConfirm={(code) => {
                    console.log('confirm the code:', code);
                    console.log('create the account');
                }}
                onResend={() => {
                    console.log('send new verification code');
                }}
                onGoBack={() => setShowEnterVerificatinCode(false)}
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
            handleContinue={handleContinue}
            showOptionAlreadyUsedModal={showOptionAlreadyUsedModal}
            onCloseOptionAlreadyUsedModal={() => setShowOptionAlreadyUsedModal(false)}
            showFundWithCreditCardOption={showFundWithCreditCardOption}
        />
    );
}