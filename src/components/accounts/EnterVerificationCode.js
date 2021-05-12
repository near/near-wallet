import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import FormButton from '../common/FormButton';
import Container from '../common/styled/Container.css';
import { Recaptcha } from '../Recaptcha';
import sendJson from '../../tmp_fetch_send_json';
import { ACCOUNT_HELPER_URL } from '../../utils/wallet';

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

    .recaptcha-failed-box {
        margin-top: 25px;
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

    // TODO: Custom recaptcha hook
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);

    let useEmail = true;
    if (option !== 'email') {
        useEmail = false;
    }

    const handleConfirm = () => {
        onConfirm(code);
    }

    // TODO: Combine similar effect code into custom hook
    const [fundedAccountAvailable, setFundedAccountAvailable] = useState(false);
    useEffect(() => {
        debugLog('Checking available funded account status');
        const fetchIsFundedAccountAvailable = async () => {
            let available;

            try {
                ({ available } = await sendJson('GET', ACCOUNT_HELPER_URL + '/checkFundedAccountAvailable'));
            } catch (e) {
                debugLog('Failed check available funded account status');
                setFundedAccountAvailable(false);
                return;
            }

            debugLog('Funded account availability', { available });
            setFundedAccountAvailable(available);
        }

        fetchIsFundedAccountAvailable();
    }, []);

    const handleOnSubmit = (e) => {
        if (code.length !== 6) {
            e.preventDefault();
            setError(true)
            return
        }

        if (code.length === 6 && !loading) {
            handleConfirm().then(() => recaptchaRef?.current?.reset());
            e.preventDefault();
        }
    }

    const shouldRenderRecaptcha = process.env.RECAPTCHA_CHALLENGE_API_KEY && isNewAccount && fundedAccountAvailable;

    return (
        <StyledContainer className='small-centered'>
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
                                disabled={loading}
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
                            onRecaptchaChange(token)
                        }}
                        onFundAccountCreation={handleOnSubmit}
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