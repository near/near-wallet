import { KeyPair } from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';
import React, { Component, createRef } from 'react';
import { Translate } from 'react-localize-redux';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Mixpanel } from '../../../mixpanel/index';
import * as accountActions from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import { actions as linkdropActions } from '../../../redux/slices/linkdrop';
import { validateEmail } from '../../../utils/account';
import { actionsPending } from '../../../utils/alerts';
import isApprovedCountryCode from '../../../utils/isApprovedCountryCode';
import parseFundingOptions from '../../../utils/parseFundingOptions';
import {
    DISABLE_CREATE_ACCOUNT,
    ENABLE_IDENTITY_VERIFIED_ACCOUNT,
    wallet
} from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import Tooltip from '../../common/Tooltip';
import { isRetryableRecaptchaError } from '../../Recaptcha';
import EnterVerificationCode from '../EnterVerificationCode';
import RecoveryOption from './RecoveryOption';

import 'react-phone-number-input/style.css';

const { setLinkdropAmount } = linkdropActions;

const {
    initializeRecoveryMethod,
    setupRecoveryMessage,
    redirectToApp,
    redirectTo,
    loadRecoveryMethods,
    getAccessKeys,
    getLedgerKey,
    get2faMethod,
    checkIsNew,
    createNewAccount,
    saveAccount,
    fundCreateAccount,
    validateSecurityCode
} = accountActions;

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;
const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('SetupRecoveryMethod:', ...args);

const StyledContainer = styled(Container)`
    button {
        margin-top: 50px !important;
        width: 100% !important;
    }

    h4 {
        margin-top: 40px;
        font-weight: 600;
        font-size: 15px;
        display: flex;
        align-items: center;
    }

`;

class SetupRecoveryMethod extends Component {

    state = {
        option: this.props.router.location.method || 'phrase',
        phoneNumber: '',
        country: '',
        email: '',
        success: false,
        emailInvalid: false,
        phoneInvalid: false,
        recoverySeedPhrase: null,
        recaptchaToken: null,
        isNewAccount: false,
        settingUpNewAccount: false
    }

    emailInput = createRef()
    phoneInput = createRef()

    async componentDidMount() {
        const { router, checkIsNew } = this.props;
        const { method } = router.location;

        if (method) {
            this.setState({ option: method });
            if (method === 'email' || method === 'phone') {
                window.scrollTo({ top: 450, left: 0 });
            }
        }

        if (this.props.activeAccountId) {
            this.handleCheckMethodStatus();
        }

        const isNewAccount = await checkIsNew(this.props.accountId);
        this.setState({ isNewAccount });
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeAccountId !== prevProps.activeAccountId) {
            this.handleCheckMethodStatus();
        }
    }

    handleCheckMethodStatus = () => {
        if (!this.checkNewAccount()) {
            this.props.loadRecoveryMethods();
            this.props.getLedgerKey();
            this.props.get2faMethod();
        }
    }

    get isValidInput() {
        const { option, phoneNumber, email, country } = this.state;

        switch (option) {
            case 'email':
                return validateEmail(email);
            case 'phone':
                return isApprovedCountryCode(country) && isValidPhoneNumber(phoneNumber);
            case 'phrase':
                return true;
            case 'ledger':
                return true;
            default:
                return false;
        }
    }

    handleNext = async () => {
        const { option, success } = this.state;
        const {
            accountId,
            location,
            redirectTo
        } = this.props;

        if (this.isValidInput && !success) {
            if (option === 'email' || option === 'phone') {
                if (option === 'email') {
                    Mixpanel.track("SR Select email");
                } else {
                    Mixpanel.track("SR Select phone");
                }
                await this.handleSendCode();
                window.scrollTo(0, 0);
            } else if (option === 'phrase') {
                Mixpanel.track("SR-SP Select seed phrase");
                redirectTo(`/setup-seed-phrase/${accountId}/phrase${location.search}`);
            } else if (option === 'ledger') {
                Mixpanel.track("SR-Ledger Select ledger");
                redirectTo(`/setup-ledger/${accountId}${location.search}`);
            }
        }
    }

    get method() {
        const { phoneNumber, email, option } = this.state;

        const method = {
            kind: option === 'email' ? 'email' : 'phone',
            detail: option === 'email' ? email : phoneNumber
        };

        return method;
    }

    handleSendCode = async () => {
        Mixpanel.track("SR Send code", { send_code_detail: this.method });
        const { accountId, initializeRecoveryMethod } = this.props;
        const recoverySeedPhrase = await initializeRecoveryMethod(accountId, this.method);
        this.setState({ success: true, recoverySeedPhrase: recoverySeedPhrase });
    }

    async setupRecoveryMessageNewAccount(accountId, method, securityCode, recoverySeedPhrase, recaptchaToken) {
        const {
            fundCreateAccount,
            createNewAccount,
            validateSecurityCode,
            saveAccount,
            location,
            setLinkdropAmount
        } = this.props;
      
        const fundingOptions = parseFundingOptions(location.search);
        this.setState({ settingUpNewAccount: true });

        try {
            const { secretKey } = parseSeedPhrase(recoverySeedPhrase);
            const recoveryKeyPair = KeyPair.fromString(secretKey);
            await validateSecurityCode(accountId, method, securityCode);
            await saveAccount(accountId, recoveryKeyPair);

            // IDENTITY VERIFIED FUNDED ACCOUNT
            if (DISABLE_CREATE_ACCOUNT && !fundingOptions && ENABLE_IDENTITY_VERIFIED_ACCOUNT) {
                try {
                    // Call function directly to handle error silently
                    await wallet.createIdentityFundedAccount({
                        accountId,
                        kind: method.kind,
                        publicKey: recoveryKeyPair.publicKey,
                        identityKey: method.detail,
                        verificationCode: securityCode,
                        recoveryMethod: method.kind
                    });
                } catch(e) {
                    console.warn(e.code);
                    await fundCreateAccount(accountId, recoveryKeyPair, method.kind);
                }
                return;
            }

            // IMPLICIT ACCOUNT
            if (DISABLE_CREATE_ACCOUNT && !fundingOptions && !recaptchaToken) {
                await fundCreateAccount(accountId, recoveryKeyPair, method.kind);
                return;
            }

            try {
                // NOT IMPLICIT ACCOUNT (testnet, linkdrop, funded to delegated account via contract helper)
                await createNewAccount(accountId, fundingOptions, method, recoveryKeyPair.publicKey, undefined, recaptchaToken);
                if (fundingOptions?.fundingAmount) {
                    setLinkdropAmount(fundingOptions.fundingAmount);
                }
            } catch (e) {
                if (e.code === 'NotEnoughBalance') {
                    Mixpanel.track('SR NotEnoughBalance creating funded account');
                    return fundCreateAccount(accountId, recoveryKeyPair, method.kind);
                }

                throw e;
            }
        } catch(e) {
            this.setState({ settingUpNewAccount: false });
        }
    }


    handleSetupRecoveryMethod = async (securityCode) => {
        const {
            accountId,
            setupRecoveryMessage,
            showCustomAlert
        } = this.props;

        const { recoverySeedPhrase, recaptchaToken, success } = this.state;

        if (success) {
            await Mixpanel.withTracking("SR Setup recovery method",
                async () => {
                    if (!this.state.isNewAccount) {
                        return setupRecoveryMessage(accountId, this.method, securityCode, this.state.recoverySeedPhrase);
                    }

                    try {
                        await this.setupRecoveryMessageNewAccount(accountId, this.method, securityCode, recoverySeedPhrase, recaptchaToken);

                    } catch (e) {
                        debugLog('setupRecoveryMessageNewAccount() failed', e.message);
                        if (e.message === 'Invalid code') {
                            showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.setupRecoveryMessageNewAccount.invalidCode',
                                errorMessage: e.message
                            });
                        } else if (isRetryableRecaptchaError(e)) {
                            Mixpanel.track('Funded account creation failed due to invalid / expired reCaptcha response from user');
                            showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode',
                                errorMessage: e.message
                            });
                        } else {
                            showCustomAlert({
                                errorMessage: e.message,
                                success: false,
                                messageCodeHeader: 'error',
                            });
                        }
                    }
                }
            );
        }
    }

    handleGoBack = () => {
        const { option } = this.state;
        Mixpanel.track(option === 'email' ? "SR Send to different email" : "SR Send to different phone");
        this.setState({
            email: '',
            phoneNumber: '',
            success: false
        });
    }

    handleBlurEmail = () => {
        this.setState((state) => ({
            emailInvalid: state.email !== '' && !this.isValidInput
        }));
    }

    handleBlurPhone = () => {
        this.setState((state) => ({
            phoneInvalid: state.phoneNumber !== '' && !this.isValidInput
        }));
    }

    checkDisabled = (method) => {
        const { recoveryMethods, activeAccountId } = this.props;
        let activeMethods = [];
        if (recoveryMethods[activeAccountId]) {
            activeMethods = recoveryMethods[activeAccountId].filter(method => method.confirmed).map(method => method.kind);
        }

        return !this.checkNewAccount() && activeMethods.includes(method);
    }

    checkNewAccount = () => {
        return this.props.accountId !== this.props.activeAccountId;
    }

    handleRecaptchaChange = (recaptchaToken) => {
        debugLog('handleRecaptchaChange()', recaptchaToken);
        this.setState({ recaptchaToken });
    }

    render() {

        const { option, phoneNumber, email, success, emailInvalid, phoneInvalid, country, isNewAccount, settingUpNewAccount } = this.state;
        const { mainLoader, accountId, activeAccountId, ledgerKey, twoFactor, location } = this.props;

        if (!success) {
            return (
                <StyledContainer className='small-centered border'>
                    <form onSubmit={e => {
                        this.handleNext();
                        e.preventDefault();
                    }}>
                        <h1><Translate id='setupRecovery.header' /></h1>
                        <h2><Translate id='setupRecovery.subHeader' /></h2>
                        <h4>
                            <Translate id='setupRecovery.advancedSecurity' />
                            <Tooltip translate='profile.security.mostSecureDesc' icon='icon-lg'/>
                        </h4>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'phrase' })}
                            option='phrase'
                            active={option}
                            disabled={this.checkDisabled('phrase')}
                        />
                        {(this.checkNewAccount() || !twoFactor) &&
                            <RecoveryOption
                                onClick={() => this.setState({ option: 'ledger' })}
                                option='ledger'
                                active={option}
                                disabled={ledgerKey !== null && accountId === activeAccountId}
                            />
                        }
                        <h4>
                            <Translate id='setupRecovery.basicSecurity' />
                            <Tooltip translate='profile.security.lessSecureDesc' icon='icon-lg'/>
                        </h4>
                        <RecoveryOption
                            onClick={() => {
                                this.setState({ option: 'email' });
                                if (option !== 'email') {
                                    setTimeout(() => {
                                        this.emailInput.current.focus();
                                    }, 0);
                                }
                            }}
                            option='email'
                            active={option}
                            disabled={this.checkDisabled('email')}
                            problem={option === 'email' && emailInvalid}
                        >
                            <Translate>
                                {({ translate }) => (
                                    <input
                                        type='email'
                                        placeholder={translate('setupRecovery.emailPlaceholder')}
                                        value={email}
                                        disabled={this.props.mainLoader}
                                        onChange={e => this.setState({ email: e.target.value, emailInvalid: false })}
                                        onBlur={this.handleBlurEmail}
                                        tabIndex='1'
                                        ref={this.emailInput}
                                    />
                                )}
                            </Translate>
                        </RecoveryOption>
                        <RecoveryOption
                            onClick={() => {
                                this.setState({ option: 'phone' });
                                if (option !== 'phone') {
                                    setTimeout(() => {
                                        this.phoneInput.current.focus();
                                    }, 0);
                                }
                            }}
                            option='phone'
                            active={option}
                            disabled={this.checkDisabled('phone')}
                            problem={option === 'phone' && phoneInvalid}
                        >
                            <Translate>
                                {({ translate }) => (
                                    <>
                                        <PhoneInput
                                            placeholder={translate('setupRecovery.phonePlaceholder')}
                                            type='phone'
                                            value={phoneNumber}
                                            disabled={this.props.mainLoader}
                                            onChange={value => this.setState({
                                                phoneNumber: value,
                                                phoneInvalid: false
                                            })}
                                            onCountryChange={option => this.setState({ country: option })}
                                            tabIndex='1'
                                            onBlur={this.handleBlurPhone}
                                            ref={this.phoneInput}
                                        />
                                        {!isApprovedCountryCode(country) &&
                                            <div className='color-red'>{translate('setupRecovery.notSupportedPhone')}</div>
                                        }
                                    </>
                                )}
                            </Translate>
                        </RecoveryOption>
                        <FormButton
                            color='blue'
                            type='submit'
                            disabled={!this.isValidInput || mainLoader}
                            sending={actionsPending(['INITIALIZE_RECOVERY_METHOD', 'SETUP_RECOVERY_MESSAGE'])}
                            trackingId='SR Click submit button'
                            data-test-id="submitSelectedRecoveryOption"
                        >
                            <Translate id='button.continue' />
                        </FormButton>
                    </form>
                </StyledContainer>
            );
        } else {
            return (
                <EnterVerificationCode
                    isNewAccount={isNewAccount}
                    option={option}
                    phoneNumber={phoneNumber}
                    email={email}
                    onConfirm={this.handleSetupRecoveryMethod}
                    onGoBack={this.handleGoBack}
                    onResend={this.handleSendCode}
                    reSending={actionsPending('INITIALIZE_RECOVERY_METHOD')}
                    verifyingCode={actionsPending('SETUP_RECOVERY_MESSAGE') || settingUpNewAccount}
                    onRecaptchaChange={this.handleRecaptchaChange}
                    isLinkDrop={parseFundingOptions(location.search) !== null}
                    skipRecaptcha={ENABLE_IDENTITY_VERIFIED_ACCOUNT}
                />
            );
        }
    }
}

const mapDispatchToProps = {
    setupRecoveryMessage,
    redirectToApp,
    loadRecoveryMethods,
    initializeRecoveryMethod,
    getAccessKeys,
    getLedgerKey,
    get2faMethod,
    checkIsNew,
    redirectTo,
    showCustomAlert,
    fundCreateAccount,
    createNewAccount,
    saveAccount,
    validateSecurityCode,
    setLinkdropAmount
};

const mapStateToProps = ({ account, router, recoveryMethods, status }, { match }) => ({
    ...account,
    router,
    accountId: match.params.accountId,
    activeAccountId: account.accountId,
    recoveryMethods,
    mainLoader: status.mainLoader
});

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);
