import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { RECAPTCHA_CHALLENGE_API_KEY } from '../../config';
import { shuffleArray } from '../../utils/arrayUtils';
import { ENABLE_IDENTITY_VERIFIED_ACCOUNT } from '../../utils/wallet';
import FormButton from '../common/FormButton';
import LocalAlertBox from '../common/LocalAlertBox';
import { Recaptcha } from '../Recaptcha';

// FIXME: Use `debug` npm package so we can keep some debug logging aroåund but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('SetupSeedPhraseVerify:', ...args);

const CustomDiv = styled.div`
    .seedphraseInputGrid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        counter-reset: input;
        background: #FFFFFF;
        box-shadow: 0px 45px 56px rgba(0, 0, 0, 0.07), 0px 10.0513px 12.5083px rgba(0, 0, 0, 0.0417275), 0px 2.99255px 3.72406px rgba(0, 0, 0, 0.0282725);
        border-radius: 8px;
        padding:16px;


        .item{
            position:relative;
            padding: 8px 16px 8px 32px;
            background: #F0F0F1;
            cursor:pointer;
            margin-bottom: 0 !important;
            min-width: 100%;
            border-radius:0;
            height: 37px;
            display:block;
            display:flex;
            align-items:center;

            &:before {
                position:absolute;
                top:calc((100% - 15px) / 2);
                left:12px;
                counter-increment: input;    
                content: ""counter(input)"";
            }

            &[data-active="true"] {
                border: 2px solid #0072CE;
                color: #2B9AF4;
            }
        }
    }

    .seedphraseSelectionGrid{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        margin-top: 32px;

        .item{
            padding: 8px 16px 8px 12px;
            background: #D6EDFF;
            color: #005497;
            cursor:pointer;
            height: 37px;
        }
    }

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


const SetupSeedPhraseVerify = (props,ref) => {
    const {
        enterWord,
        handleChangeWord,
        mainLoader,
        localAlert,
        onRecaptchaChange,
        isNewAccount,
        onSubmit,
        isLinkDrop,
        hasSeedPhraseRecovery,
        handleStartOver,
        seedPhrase
    }= props;
    debugLog('Re-rendering', { isNewAccount: isNewAccount });
    const recaptchaRef = useRef(null);
    const [recaptchaToken, setRecaptchaToken] = useState();
    const [seedPhaseEntry, setSeedPhraseEntry] = useState(Array(12).fill(''));
    const activeIndex =  seedPhaseEntry.filter(Boolean).length;
    const shuffledSeedPhrase= shuffleArray(seedPhrase.split(' '));

    const handlePushWordIntoSeedhrase =(word)=>{
        const tempArray = [...seedPhaseEntry];
        tempArray[activeIndex]=word;
        setSeedPhraseEntry([...tempArray]);
    };

    useImperativeHandle(ref, () => ({
        reset() {
            debugLog('in imperative handle reset()');
            return recaptchaRef.current.reset();
        }
    }));

    const shouldRenderRecaptcha = !ENABLE_IDENTITY_VERIFIED_ACCOUNT && !isLinkDrop && RECAPTCHA_CHALLENGE_API_KEY && isNewAccount;

    return (
        <CustomDiv>
            <div className='seedphraseInputGrid'>
                {seedPhaseEntry.map((word, i)=>{
                    return <div className='item' data-active={activeIndex===i}>{word}</div>;
                })}
            </div>
            <div className='seedphraseSelectionGrid'>
                {shuffledSeedPhrase.filter((word)=>!seedPhaseEntry.includes(word)).map((word)=>{
                    return <div className='item' onClick={()=>{
                        handlePushWordIntoSeedhrase(word);
                    }}>{word}</div>;
                })}
            </div>
           
            <Translate>
                {({ translate }) => (
                    <input
                        data-test-id="seedPhraseVerificationWordInput"
                        name='enterWord'
                        value={enterWord}
                        onChange={(e) => handleChangeWord(e.target.value)}
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
                disabled={hasSeedPhraseRecovery || activeIndex!==12 || mainLoader || (!recaptchaToken && shouldRenderRecaptcha)}
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

