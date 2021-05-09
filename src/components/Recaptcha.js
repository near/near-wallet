import React, { Component } from 'react'
import styled from 'styled-components'
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_CHALLENGE_API_KEY = process.env.RECAPTCHA_CHALLENGE_API_KEY;

// How long we should wait for the script to load before assuming it's been blocked
const RECAPTCHA_LOADING_TIMEOUT = 15 * 1000;

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;

const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('Recaptcha:', ...args);

const RecaptchaString = styled.div`
    margin-bottom: -10px;
    font-size: 12px;
    padding-top: 24px;
    font-weight: 300;

    a {
        color: inherit;
        text-decoration: underline;
    }
`


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
                this.setState({ loadFailed: true })
            },
            RECAPTCHA_LOADING_TIMEOUT
        )
    }

    clearLoadingTimeout() {
        if (this.loadingTimeoutHandle) {
            clearTimeout(this.loadingTimeoutHandle)
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
    };

    /** Do not refactor this to an in-line function!
     * Must be a stable function, or recaptcha will infinitely loop on reloading itself in the background
     * If porting to Hooks, use useMemo() to get a stable reference to the function
     * @param token recaptchaToken returned by recaptcha API
     */
    handleOnChange = (token) => {
        debugLog('onchange()', token);
        this.props.onChange && this.props.onChange(token);
    }

    handleOnLoad = (scriptDetails) => {
        debugLog('handleOnLoad()', scriptDetails);

        this.clearLoadingTimeout();

        if (scriptDetails.errored === true) {
            this.setState({ loaded: false, loadFailed: true });
            this.props.onLoadFailed && this.props.onLoadFailed();
        } else {
            this.setState({ loaded: true });
        }
    }

    reset() {
        debugLog('reset()');
        if (this.recaptchaRef) { this.recaptchaRef.reset(); }
        // Reset does not call onChange; manually notify subscribers that there is no longer a valid token on reset
        this.handleOnChange(null);
    }

    // FIXME: Translate strings
    render() {
        const { loaded, loadFailed } = this.state;

        if (loadFailed) {
            return (<RecaptchaString>Failed to load recaptcha!</RecaptchaString>)
        }

        debugLog('Rendering', { recaptchaRef: this.recaptchaRef });
        return (<>
            {!loaded && (<span>Loading reCAPTCHA...</span>)}
            {loaded && (<RecaptchaString>
                This site is protected by reCAPTCHA and the Google <a
                href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer'>Privacy
                Policy</a> and <a href='https://policies.google.com/terms' target='_blank'
                                  rel='noopener noreferrer'>Terms of Service</a> apply.
            </RecaptchaString>)}
            {RECAPTCHA_CHALLENGE_API_KEY && <ReCAPTCHA
                sitekey={RECAPTCHA_CHALLENGE_API_KEY}
                ref={(ref) => this.setCaptchaRef(ref)}
                onChange={this.handleOnChange}
                asyncScriptOnLoad={this.handleOnLoad}
                style={{ marginTop: '25px' }}
            />}
        </>)
    }
}

export const isRetryableRecaptchaError = (e) => {
    if (!e.code) { return false; }

    return ['invalid-input-response','missing-input-response', 'timeout-or-duplicate'].includes(e.code);
}