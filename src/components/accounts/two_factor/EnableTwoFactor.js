import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import TwoFactorOption from './TwoFactorOption';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import FormButton from '../../common/FormButton';

const Container = styled.form`
    h2 {
        max-width: 800px;
        color: #4a4f54 !important;

        @media (max-width: 767px) {
            font-size: 14px !important;
            line-height: 18px !important;
            color: #999 !important;
            margin-bottom: -15px;
        }
    }

    h4 {
        margin-top: 40px;

        span {
            color: #FF585D;
        }
    }

    button {
        margin-top: 50px !important;
    }
`

export function EnableTwoFactor() {

    const [option, setOption] = useState('email');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleNext = () => {

    }

    return (
        <Container className='ui container' onSubmit={e => {handleNext(); e.preventDefault();}}>
            <h1>Enable Two-Factor Authentication</h1>
            <h2>We highly encourage you to enable two-factor authentication. Update this copy.</h2>
            <h4>Select Authentication Meethod<span>*</span></h4>
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
                disabled={false}
                sending={false}
            >
                <Translate id={`button.continue`}/>
            </FormButton>
        </Container>
    )
}