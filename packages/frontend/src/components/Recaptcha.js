import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { RECAPTCHA_CHALLENGE_API_KEY } from '../config';
import { Mixpanel } from '../mixpanel/index';
import FormButton from './common/FormButton';
import PuzzleIcon from './svg/PuzzleIcon';

// How long we should wait for the script to load before assuming it's been blocked
const RECAPTCHA_LOADING_TIMEOUT = 15 * 1000;

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;

const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('Recaptcha:', ...args);

const RecaptchaFailedBox = styled.div`
    border: 1px dashed #FF8588;
    border-radius: 2px;
    background-color: #FEF2F2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 30px;
    margin-bottom: 30px;

    .title {
        color: #A00005;
        font-weight: 600;
    }

    .desc {
        color: #DC1F25;
    }

    button {
        font-weight: normal !important;
        text-decoration: underline !important;
    }

    .title, .desc, button {
        margin-top: 20px !important;
    }
`;

const RecaptchaString = styled.div`
    font-size: 12px;
    font-weight: 300;
    color: #72727A;
    margin: 10px auto 40px auto;
    text-align: center;
    max-width: 304px;

    a {
        color: inherit;
        text-decoration: underline;
    }
`;


export class Recaptcha extends Component {
    recaptchaRef = null
    loadingTimeoutHandle = null;

    state = {
        loaded: false,
        loadFailed: false
    }

    resetLoadingTimeout() {
        debugLog('Setting script load timeout', { RECAPTCHA_LOADING_TIMEOUT });
        this.clearLoadingTimeout();
        this.loadingTimeoutHandle = setTimeout(
            () => {
                this.setState({ loadFailed: true });
            },
            RECAPTCHA_LOADING_TIMEOUT
        );
    }

    clearLoadingTimeout() {
        if (this.loadingTimeoutHandle) {
            clearTimeout(this.loadingTimeoutHandle) ;
        }
        this.loadingTimeoutHandle = null;
    }

    componentDidMount() {
        this.resetLoadingTimeout();
    }

    componentWillUnmount() {
        this.clearLoadingTimeout();
    }

    setCaptchaRef(ref) {
        if (ref) { this.recaptchaRef = ref; }
    }

    /** Do not refactor this to an in-line function!
     * Must be a stable function, or recaptcha will infinitely loop on reloading itself in the background
     * If porting to Hooks, use useMemo() to get a stable reference to the function
     * @param token recaptchaToken returned by recaptcha API
     */
    handleOnChange = (token) => {
        debugLog('onchange()', token);

        if (token) {
            Mixpanel.track('solved reCaptcha');
        }

        this.props.onChange && this.props.onChange(token);
    }

    handleOnLoad = (scriptDetails) => {
        debugLog('handleOnLoad()', scriptDetails);

        this.clearLoadingTimeout();

        if (scriptDetails.errored === true) {
            Mixpanel.track('failed to load reCaptcha script');

            this.setState({ loaded: false, loadFailed: true });
            this.props.onLoadFailed && this.props.onLoadFailed();
        } else {
            Mixpanel.track('loaded reCaptcha script');
            this.setState({ loaded: true });
        }

    }

    reset() {
        debugLog('reset()');
        if (this.recaptchaRef) { this.recaptchaRef.reset(); }
        // Reset does not call onChange; manually notify subscribers that there is no longer a valid token on reset
        this.handleOnChange(null);
    }

    render() {
        const { loaded, loadFailed } = this.state;

        if (loadFailed) {
            return (
                <RecaptchaFailedBox className='recaptcha-failed-box'>
                    <PuzzleIcon/>
                    <div className='title'><Translate id='reCAPTCHA.fail.title'/></div>
                    <div className='desc'><Translate id='reCAPTCHA.fail.desc'/></div>
                    <FormButton
                        color='link'
                        onClick={() => {
                            Mixpanel.track('CA used reCaptcha escape hatch');
                            this.props.onFundAccountCreation();
                        }}
                    >
                        <Translate id='reCAPTCHA.fail.link'/>
                    </FormButton>
                </RecaptchaFailedBox>
            );
        }

        debugLog('Rendering', { recaptchaRef: this.recaptchaRef });

        return (
            <>
                {!loaded &&
                    <span>
                        <Translate id='reCAPTCHA.loading'/>
                    </span>
                }
                {RECAPTCHA_CHALLENGE_API_KEY && <ReCAPTCHA
                    sitekey={RECAPTCHA_CHALLENGE_API_KEY}
                    ref={(ref) => this.setCaptchaRef(ref)}
                    onChange={this.handleOnChange}
                    asyncScriptOnLoad={this.handleOnLoad}
                    className='recaptcha-widget'
                />}
                {loaded &&
                    <RecaptchaString className='recaptcha-disclaimer'>
                        <Translate id='reCAPTCHA.disclaimer'/>
                    </RecaptchaString>
                }
            </>
        );
    }
}

export const isRetryableRecaptchaError = (e) => {
    if (!e.code) { return false; }

    return ['invalid-input-response','missing-input-response', 'timeout-or-duplicate'].includes(e.code);
};