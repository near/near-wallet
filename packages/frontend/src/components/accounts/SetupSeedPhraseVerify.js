import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { RECAPTCHA_CHALLENGE_API_KEY } from '../../config';
import { ENABLE_IDENTITY_VERIFIED_ACCOUNT } from '../../utils/wallet';
import FormButton from '../common/FormButton';
import LocalAlertBox from '../common/LocalAlertBox';
import { Recaptcha } from '../Recaptcha';
import SafeTranslate from '../SafeTranslate';

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('SetupSeedPhraseVerify:', ...args);

const CustomDiv = styled.div`

    input {
        margin-bottom: 30px !important;
    }

    .blue, .input {
        width: 100% !important;
    }

    h4 {
        margin-top: 20px;
    }

    .blue {
        margin-top: 20px !important;
    }

    &&& {
        button {
            &.link {
                &.start-over {
                    margin: 30px auto 0 auto;
                    display: inherit;
                }
            }
        }
    }

    .recaptcha-widget {
        margin-top: -10px;
    }
`;


const SetupSeedPhraseVerify = (
    {
        enterWord,
        wordId,
        handleChangeWord,
        mainLoader,
        localAlert,
        onRecaptchaChange,
        isNewAccount,
        onSubmit,
        isLinkDrop,
        hasSeedPhraseRecovery,
        handleStartOver
    },
    ref
) => {
    debugLog('Re-rendering', { isNewAccount: isNewAccount });
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState();

    useImperativeHandle(ref, () => ({
        reset() {
            debugLog('in imperative handle reset()');
            return recaptchaRef.current.reset();
        }
    }));

    const shouldRenderRecaptcha = !ENABLE_IDENTITY_VERIFIED_ACCOUNT && !isLinkDrop && RECAPTCHA_CHALLENGE_API_KEY && isNewAccount;

    return (
        <CustomDiv>
            <h4 data-test-id="seedPhraseVerificationWordNumber">
                <SafeTranslate
                    id="input.enterWord.title"
                    data={{ wordId: wordId + 1 }}
                />
            </h4>
            <Translate>
                {({ translate }) => (
                    <input
                        data-test-id="seedPhraseVerificationWordInput"
                        name='enterWord'
                        value={enterWord}
                        onChange={e => handleChangeWord(e.target.value)}
                        placeholder={translate('input.enterWord.placeholder')}
                        required
                        tabIndex='1'
                        pattern='[a-zA-Z ]*'
                        className={localAlert ? (localAlert.success ? 'success' : 'problem') : ''}
                        disabled={mainLoader}
                    />
                )}
            </Translate>
            <LocalAlertBox localAlert={localAlert}/>
            {
                shouldRenderRecaptcha && <Recaptcha
                    ref={recaptchaRef}
                    onChange={(token) => {
                        debugLog('onChange from recaptcha', token);
                        setRecaptchaToken(token);
                        onRecaptchaChange(token);
                    }}
                    onFundAccountCreation={onSubmit}
                />
            }
            <FormButton
                type='submit'
                color='blue'
                disabled={hasSeedPhraseRecovery || !enterWord || mainLoader || (!recaptchaToken && shouldRenderRecaptcha)}
                sending={mainLoader}
                sendingString={isNewAccount ? 'button.creatingAccount' : 'button.verifying'}
                data-test-id="seedPhraseVerificationWordSubmit"
            >
                <Translate id='button.verify'/>
            </FormButton>
            <FormButton
                type='button'
                color='gray'
                className='link start-over'
                onClick={handleStartOver}
            >
                <Translate id='button.startOver'/>
            </FormButton>
        </CustomDiv>
    );
};

export default forwardRef(SetupSeedPhraseVerify);