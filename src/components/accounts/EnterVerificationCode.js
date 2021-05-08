import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import { Recaptcha } from '../Recaptcha';

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('EnterVerificationCode:', ...args);

const StyledContainer = styled(Container)`

    h4 {
        margin-top: 30px;
    }

    input {
        width: 100%;
        margin-top: 8px !important;
    }

    button {
        width: 100% !important;
        margin-top: 40px !important;
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
`

const EnterVerificationCode = ({
    option,
    onConfirm,
    onGoBack,
    onResend,
    email,
    phoneNumber,
    loading,
    isNewAccount,
    onRecaptchaChange
}) => {
    debugLog('Rendering', { isNewAccount });
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaLoadFailed, setRecaptchaLoadFailed] = useState(false);
    const [code, setCode] = useState('');

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    const handleConfirm = async () => {
        if (code.length === 6 && !loading) {
            return onConfirm(code);
        }
    }

    const handleRecaptchaLoadFailed = () => setRecaptchaLoadFailed(true)

    const shouldRenderRecaptcha = process.env.RECAPTCHA_CHALLENGE_API_KEY && isNewAccount && !recaptchaLoadFailed;
    return (
        <StyledContainer className='small-centered'>
            <form
                onSubmit={e => {
                    handleConfirm().then(() => recaptchaRef?.current?.reset());
                    e.preventDefault();
                }}
                autoComplete='off'
            >
                <h1><Translate id='setRecoveryConfirm.title'/></h1>
                <h2><Translate id='setRecoveryConfirm.pageText'/> <Translate
                    id={useEmail ? 'setRecoveryConfirm.email' : 'setRecoveryConfirm.phone'}/>: <span>{useEmail ? email : phoneNumber}</span>
                </h2>
                <h4 className='small'><Translate id='setRecoveryConfirm.inputHeader'/></h4>
                <Translate>
                    {({ translate }) => (
                        <>
                            <input
                                type='number'
                                pattern='[0-9]*'
                                placeholder={translate('setRecoveryConfirm.inputPlaceholder')}
                                aria-label={translate('setRecoveryConfirm.inputPlaceholder')}
                                value={code}
                                disabled={loading}
                                onChange={e => setCode(e.target.value)}
                                autoFocus={true}
                            />
                        </>
                    )}
                </Translate>
                {
                    shouldRenderRecaptcha && <Recaptcha
                        ref={recaptchaRef}
                        onLoadFailed={handleRecaptchaLoadFailed}
                        onChange={(token) => {
                            debugLog('onChange from recaptcha - setting token in state', token);
                            setRecaptchaToken(token);
                            onRecaptchaChange(token)
                        }}
                    />
                }
                <FormButton
                    color='blue'
                    type='submit'
                    disabled={code.length !== 6 || loading || (!recaptchaToken && shouldRenderRecaptcha)}
                    sending={loading}
                    sendingString='button.verifying'
                >
                    <Translate id='button.verifyCodeEnable'/>
                </FormButton>
            </form>

            <div className='resend'>
                <div><Translate id='setRecoveryConfirm.didNotRecive'/></div>
                <div>
                    <span onClick={onResend} className='link'><Translate id='setRecoveryConfirm.resendCode'/></span>
                    &nbsp;<Translate id='setRecoveryConfirm.or'/>&nbsp;<span onClick={onGoBack}
                                                                             className='link'><Translate
                    id='setRecoveryConfirm.sendToDifferent'/> <Translate
                    id={`setRecoveryConfirm.${useEmail ? 'email' : 'phone'}`}/></span>
                </div>
            </div>
        </StyledContainer>
    )
}

EnterVerificationCode.propTypes = {
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    option: PropTypes.string.isRequired,
    onGoBack: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export default EnterVerificationCode;