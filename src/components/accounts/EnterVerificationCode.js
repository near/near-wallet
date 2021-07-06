import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import { Recaptcha } from '../Recaptcha';

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('EnterVerificationCode:', ...args);

const StyledContainer = styled(Container)`

    h2 {
        span {
            color: #72727A;
            font-weight: 600;
        }
    }

    h4 {
        margin-top: 30px;
    }

    input {
        width: 100%;
        margin-top: 8px !important;
    }

    button {
        width: 100% !important;
        margin-top: 50px !important;

        &.link {
            &.red {
                margin: 30px auto 0 auto !important;
                display: block !important;
            }
        }
    }

    .resend {
        margin-top: 35px;
        display: flex;
        flex-direction: column;
        align-items: center;

        div {
            :first-of-type {
                color: #3F4045;
                margin-bottom: 10px;
            }

            :last-of-type {
                @media (max-width: 430px) {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }
        }

        .link {
            text-decoration: underline;
        }
    }

    .recaptcha-failed-box, .recaptcha-widget {
        margin-top: 20px;
    }
`;

const EnterVerificationCode = ({
    option,
    onConfirm,
    onGoBack,
    onResend,
    reSending,
    email,
    phoneNumber,
    verifyingCode,
    isNewAccount,
    onRecaptchaChange,
    isLinkDrop
}) => {
    debugLog('Rendering', { isNewAccount });

    // TODO: Custom recaptcha hook
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    const handleConfirm = async () => {
        onConfirm(code);
    };

    const handleOnSubmit = (e) => {
        if (code.length !== 6) {
            e.preventDefault();
            setError(true);
            return;
        }

        if (code.length === 6 && !verifyingCode) {
            handleConfirm().then(() => recaptchaRef?.current?.reset());
            e.preventDefault();
        }
    };

    const shouldRenderRecaptcha = !isLinkDrop && process.env.RECAPTCHA_CHALLENGE_API_KEY && isNewAccount;

    return (
        <StyledContainer className='small-centered border'>
            <form
                onSubmit={handleOnSubmit}
                autoComplete='off'
            >
                <h1><Translate id='setRecoveryConfirm.title'/></h1>
                <h2><Translate id='setRecoveryConfirm.pageText'/> <Translate
                    id={useEmail ? 'setRecoveryConfirm.email' : 'setRecoveryConfirm.phone'}/>: <span>{useEmail ? email : phoneNumber}</span>
                </h2>
                <h4 className='small'><Translate id='setRecoveryConfirm.inputHeader'/></h4>
                <Translate>
                    {({ translate }) => (
                        <div className={error ? 'problem' : ''}>
                            <input
                                type='number'
                                pattern='[0-9]*'
                                placeholder={translate('setRecoveryConfirm.inputPlaceholder')}
                                aria-label={translate('setRecoveryConfirm.inputPlaceholder')}
                                value={code}
                                disabled={verifyingCode}
                                onChange={e => {setCode(e.target.value); setError(false);}}
                                autoFocus={true}
                            />
                        </div>
                    )}
                </Translate>
                {
                    shouldRenderRecaptcha && <Recaptcha
                        ref={recaptchaRef}
                        onChange={(token) => {
                            debugLog('onChange from recaptcha - setting token in state', token);
                            setRecaptchaToken(token);
                            onRecaptchaChange(token);
                        }}
                        onFundAccountCreation={handleOnSubmit}
                    />
                }
                <FormButton
                    color='blue'
                    type='submit'
                    disabled={code.length !== 6 || verifyingCode || (!recaptchaToken && shouldRenderRecaptcha)}
                    sending={verifyingCode}
                    sendingString={isNewAccount ? 'button.creatingAccount' : 'button.verifying'}
                >
                    <Translate id='button.verifyCodeEnable'/>
                </FormButton>
                <FormButton
                    className='link red'
                    onClick={onGoBack}
                >
                    <Translate id='button.cancel'/>
                </FormButton>
            </form>

            <div className='resend'>
                <div><Translate id='setRecoveryConfirm.didNotRecive'/></div>
                <div>
                    <span onClick={!reSending ? onResend : () => {}} className='link'><Translate id={`setRecoveryConfirm.${!reSending ? 'resendCode' : 'resending'}`}/></span>
                    &nbsp;<Translate id='setRecoveryConfirm.or'/>&nbsp;<span onClick={onGoBack} className='link'>
                        <Translate id='setRecoveryConfirm.sendToDifferent'/> <Translate id={`setRecoveryConfirm.${useEmail ? 'email' : 'phone'}`}/></span>
                </div>
            </div>
        </StyledContainer>
    );
};

EnterVerificationCode.propTypes = {
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    option: PropTypes.string.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default EnterVerificationCode;