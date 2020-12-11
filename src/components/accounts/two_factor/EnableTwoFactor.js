import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import TwoFactorOption from './TwoFactorOption';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../../utils/account';
import { MULTISIG_MIN_AMOUNT } from '../../../utils/wallet'
import FormButton from '../../common/FormButton';
import AlertBanner from '../../common/AlertBanner';
import {
    initTwoFactor,
    verifyTwoFactor,
    deployMultisig,
    redirectToApp
} from '../../../actions/account';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';
import EnterVerificationCode from '../EnterVerificationCode'
import Container from '../../common/styled/Container.css'
import { onKeyDown } from '../../../hooks/eventListeners'

const StyledContainer = styled(Container)`

    h4 {
        margin-top: 40px;

        span {
            color: #FF585D;
        }
    }

    button {
        margin-top: 50px !important;
        width: 100% !important;

        &.link {
            text-transform: none !important;
            margin-top: 30px !important;
            text-decoration: none !important;
            width: auto !important;
            margin: 30px auto 0 auto !important;
            display: block !important;
        }
    }
`

export function EnableTwoFactor(props) {

    const dispatch = useDispatch();
    const { formLoader, accountId, has2fa } = useSelector(({ account }) => account);
    const [initiated, setInitiated] = useState(false);
    const [option, setOption] = useState('email');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const recoveryMethods = useRecoveryMethods(accountId);
    const loading = formLoader

    onKeyDown(e => {
        if (e.keyCode === 13 && isValidInput() && !loading) {
            handleNext()
        }
    });

    const method = {
        kind: `2fa-${option}`,
        detail: option === 'email' ? email : phoneNumber
    }

    useEffect(() => {
        const email = recoveryMethods.filter(method => method.kind === 'email')[0];
        const phone = recoveryMethods.filter(method => method.kind === 'phone')[0];

        if (email) {
            setEmail(email.detail)
        }

        if (phone) {
            setPhoneNumber(phone.detail)
        }

    }, [recoveryMethods]);

    const handleNext = async () => {
        let response;
        try {
            response = await dispatch(initTwoFactor(accountId, method))
        } finally {
            if (response && response.confirmed) {
                handleDeployMultisig()
            } else {
                setInitiated(true)
            }
        }
    }

    const handleConfirm = async (securityCode) => {
        await dispatch(verifyTwoFactor(securityCode))
        handleDeployMultisig()
    }

    const handleDeployMultisig = async () => {
        await dispatch(deployMultisig())
        dispatch(redirectToApp('/profile'))
    }

    const handleGoBack = () => {
        setInitiated(false)
    }

    const isValidInput = () => {
        switch (option) {
            case 'email':
                return validateEmail(email)
            case 'phone':
                return isValidPhoneNumber(phoneNumber)
            default:
                return false
        }
    }

    if (!initiated) {
        return (
            <StyledContainer className='small-centered'>
                <AlertBanner
                    title='twoFactor.alertBanner.title'
                    data={MULTISIG_MIN_AMOUNT}
                    button='twoFactor.alertBanner.button'
                    theme='light-blue'
                    linkTo='https://docs.near.org/docs/concepts/storage'
                />
                <form onSubmit={e => { handleNext(); e.preventDefault(); }}>
                    <h1><Translate id='twoFactor.enable' /></h1>
                    <h2><Translate id='twoFactor.subHeader' /></h2>
                    <h4><Translate id='twoFactor.select' /><span>*</span></h4>
                    <TwoFactorOption
                        onClick={() => setOption('email')}
                        option='email'
                        active={option}
                    >
                        <Translate>
                            {({ translate }) => (
                                <input
                                    type='email'
                                    placeholder={translate('setupRecovery.emailPlaceholder')}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    tabIndex='1'
                                />
                            )}
                        </Translate>
                    </TwoFactorOption>
                    <TwoFactorOption
                        onClick={() => setOption('phone')}
                        option='phone'
                        active={option}
                    >
                        <Translate>
                            {({ translate }) => (
                                <PhoneInput
                                    placeholder={translate('setupRecovery.phonePlaceholder')}
                                    value={phoneNumber}
                                    onChange={value => setPhoneNumber(value)}
                                    tabIndex='1'
                                />
                            )}
                        </Translate>
                    </TwoFactorOption>
                    <FormButton
                        color='blue'
                        type='submit'
                        disabled={!isValidInput() || loading || has2fa}
                        sending={loading}
                    >
                        <Translate id={`button.continue`} />
                    </FormButton>
                    <FormButton className='link' linkTo='/profile'><Translate id='button.skip' /></FormButton>
                </form>
            </StyledContainer>
        )
    } else {
        return (
            <EnterVerificationCode
                option={option}
                phoneNumber={phoneNumber}
                email={email}
                onConfirm={handleConfirm}
                onGoBack={handleGoBack}
                onResend={handleNext}
                loading={loading}
                requestStatus={props.requestStatus}
            />
        )
    }
}