import { utils } from 'near-api-js';
import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { MULTISIG_MIN_AMOUNT } from '../../../config';
import { useRecoveryMethods } from '../../../hooks/recoveryMethods';
import { Mixpanel } from '../../../mixpanel/index';
import {
    initTwoFactor,
    verifyTwoFactor,
    deployMultisig,
    redirectToApp
} from '../../../redux/actions/account';
import { clearGlobalAlert } from '../../../redux/actions/status';
import { selectAccountHas2fa, selectAccountId } from '../../../redux/slices/account';
import { selectActionsPending, selectStatusSlice } from '../../../redux/slices/status';
import { selectNearTokenFiatValueUSD } from '../../../redux/slices/tokenFiatValues';
import { validateEmail } from '../../../utils/account';
import isApprovedCountryCode from '../../../utils/isApprovedCountryCode';
import AlertBanner from '../../common/AlertBanner';
import { getNearAndFiatValue } from '../../common/balance/helpers';
import Checkbox from '../../common/Checkbox';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import SafeTranslate from '../../SafeTranslate';
import EnterVerificationCode from '../EnterVerificationCode';
import TwoFactorOption from './TwoFactorOption';

const {
    parseNearAmount
} = utils.format;

const StyledContainer = styled(Container)`

    h4 {
        margin-top: 40px;

        span {
            color: #FF585D;
        }
    }

    button {
        width: 100% !important;

        &.blue {
            margin-top: 20px !important;
        }

        &.link {
            text-transform: none !important;
            margin-top: 30px !important;
            text-decoration: none !important;
            width: auto !important;
            margin: 30px auto 0 auto !important;
            display: block !important;
        }
    }

    label {
        display: flex;
        align-items: center;
        border: 1px solid #F0F0F1;
        border-radius: 8px;
        padding: 15px;
        margin-top: 50px;
        cursor: pointer;

        > span {
            margin-left: 15px;
            font-style: italic;
            color: #72727A;
            font-size: 12px;
            font-weight: 500;
        }
    }
`;

export function EnableTwoFactor(props) {

    const dispatch = useDispatch();
    const has2fa = useSelector(selectAccountHas2fa);
    const accountId = useSelector(selectAccountId);
    const status = useSelector(selectStatusSlice);
    const nearTokenFiatValueUSD = useSelector(selectNearTokenFiatValueUSD);

    const [initiated, setInitiated] = useState(false);
    const [option, setOption] = useState('email');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [twoFactorAmountApproved, setTwoFactorAmountApproved] = useState(false);
    const recoveryMethods = useRecoveryMethods(accountId);
    const loading = status.mainLoader;
    const pendingTwoFactorAction = useSelector((state) => selectActionsPending(state, { types: ['INIT_TWO_FACTOR', 'DEPLOY_MULTISIG'] }));
    const reSending = useSelector((state) => selectActionsPending(state, { types: 'INIT_TWO_FACTOR' }));

    const multiSigMinAmountRaw = parseNearAmount(MULTISIG_MIN_AMOUNT);

    const method = {
        kind: `2fa-${option}`,
        detail: option === 'email' ? email : phoneNumber
    };

    useEffect(() => {
        const email = recoveryMethods.filter(method => method.kind === 'email')[0];
        const phone = recoveryMethods.filter(method => method.kind === 'phone')[0];

        if (email) {
            setEmail(email.detail);
        }

        if (phone) {
            setPhoneNumber(phone.detail);
        }

    }, [recoveryMethods]);

    const handleNext = async () => {
        if (!initiated && !loading && !has2fa && isValidInput()) {
            let response;
            Mixpanel.track("2FA Click continue button", {option: option});
            await Mixpanel.withTracking("2FA Initialize two factor",
                async () => response = await dispatch(initTwoFactor(accountId, method)),
                () => {},
                async () => {
                    if (response && response.confirmed) {
                        await Mixpanel.withTracking("2FA Deploy multisig",
                            async () => await handleDeployMultisig()
                        );
                    } else {
                        setInitiated(true);
                    }
                }
            );
        }
    };

    const handleResendCode = async () => {
        Mixpanel.track("2FA Resend code");
        await dispatch(initTwoFactor(accountId, method));
    };

    const handleConfirm = async (securityCode) => {
        if (initiated && securityCode.length === 6) {
            await Mixpanel.withTracking("2FA Verify", 
                async () => {
                    await dispatch(verifyTwoFactor(securityCode));
                    await dispatch(clearGlobalAlert());
                    await handleDeployMultisig();
                }
            );
        }
    };

    const handleDeployMultisig = async () => {
        await dispatch(deployMultisig());
        await dispatch(redirectToApp('/profile'));
    };

    const handleGoBack = () => {
        setInitiated(false);
        Mixpanel.track("2FA Go back");
    };

    const isValidInput = () => {
        switch (option) {
            case 'email':
                return validateEmail(email);
            case 'phone':
                return isApprovedCountryCode(country) && isValidPhoneNumber(phoneNumber);
            default:
                return false;
        }
    };

    if (!initiated) {
        return (
            <StyledContainer className='small-centered border'>
                <AlertBanner
                    title='twoFactor.alertBanner.title'
                    data={getNearAndFiatValue(multiSigMinAmountRaw, nearTokenFiatValueUSD)}
                    button='twoFactor.alertBanner.button'
                    theme='alert'
                    linkTo='https://docs.near.org/docs/concepts/storage-staking'
                />
                <form onSubmit={e => { handleNext(); e.preventDefault();}}>
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
                                    disabled={loading}
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
                                <>
                                    <PhoneInput
                                        placeholder={translate('setupRecovery.phonePlaceholder')}
                                        value={phoneNumber}
                                        onChange={value => setPhoneNumber(value)}
                                        onCountryChange={option => setCountry(option)}
                                        tabIndex='1'
                                        disabled={loading}
                                    />
                                    {!isApprovedCountryCode(country) && 
                                        <div className='color-red'>{translate('setupRecovery.notSupportedPhone')}</div>
                                    }
                                </>
                            )}
                        </Translate>
                    </TwoFactorOption>
                    <label>
                        <Checkbox
                            checked={twoFactorAmountApproved}
                            onChange={e => setTwoFactorAmountApproved(e.target.checked)}
                        />
                        <span><SafeTranslate id='twoFactor.checkBox' data={{ amount: getNearAndFiatValue(multiSigMinAmountRaw, nearTokenFiatValueUSD) }}/></span>
                    </label>
                    <FormButton
                        color='blue'
                        disabled={!isValidInput() || loading || has2fa || initiated || !twoFactorAmountApproved}
                        type='submit'
                        sending={pendingTwoFactorAction}
                        sendingString='button.enabling'
                    >
                        <Translate id={`button.continue`} />
                    </FormButton>
                    <FormButton 
                        className='link' 
                        type='button' 
                        linkTo='/profile' 
                        trackingId="2FA Click skip button"
                    >
                        <Translate id='button.skip' />
                    </FormButton>
                </form>
            </StyledContainer>
        );
    } else {
        return (
            <EnterVerificationCode
                option={option}
                phoneNumber={phoneNumber}
                email={email}
                onConfirm={handleConfirm}
                onGoBack={handleGoBack}
                onResend={handleResendCode}
                reSending={reSending}
                verifyingCode={loading}
                localAlert={status.localAlert}
            />
        );
    }
}
