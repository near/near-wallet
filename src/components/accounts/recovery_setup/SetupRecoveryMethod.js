import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux'
import { parse as parseQuery } from 'query-string'
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../../utils/account';
import {
    initializeRecoveryMethod,
    setupRecoveryMessage,
    setupRecoveryMessageNewAccount,
    redirectToApp,
    redirectTo,
    loadRecoveryMethods,
    getAccessKeys,
    getLedgerKey,
    get2faMethod,
    checkIsNew
} from '../../../actions/account';
import RecoveryOption from './RecoveryOption';
import FormButton from '../../common/FormButton';
import EnterVerificationCode from '../EnterVerificationCode';
import Container from '../../common/styled/Container.css';
import isApprovedCountryCode from '../../../utils/isApprovedCountryCode'
import { Mixpanel } from '../../../mixpanel/index'
import { actionsPending } from '../../../utils/alerts'
import { showCustomAlert } from '../../../actions/status';
import { isRetryableRecaptchaError } from '../../Recaptcha';

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
    }

`

class SetupRecoveryMethod extends Component {

    state = {
        option: 'phrase',
        phoneNumber: '',
        country: '',
        email: '',
        success: false,
        emailInvalid: false,
        phoneInvalid: false,
        recoverySeedPhrase: null,
        recaptchaToken: null,
        isNewAccount: false
    }

    emailInput = createRef()
    phoneInput = createRef()

    async componentDidMount() {
        const { router, checkIsNew } = this.props;
        const { method } = router.location;

        if (method) {
            this.setState({ option: method });
        }

        if (this.props.activeAccountId) {
            this.handleCheckMethodStatus()
        }

        const isNewAccount = await checkIsNew(this.props.accountId);
        this.setState({ isNewAccount });
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeAccountId !== prevProps.activeAccountId) {
            this.handleCheckMethodStatus()
        }
    }

    handleCheckMethodStatus = () => {
        if (!this.checkNewAccount()) {
            this.props.loadRecoveryMethods()
            this.props.getLedgerKey()
            this.props.get2faMethod()
        }
    }

    get isValidInput() {
        const { option, phoneNumber, email, country } = this.state;

        switch (option) {
        case 'email':
            return validateEmail(email)
        case 'phone':
            return isApprovedCountryCode(country) && isValidPhoneNumber(phoneNumber)
        case 'phrase':
            return true
        case 'ledger':
            return true
        default:
            return false
        }
    }

    handleNext = async () => {
        const { option, success } = this.state;
        const {
            accountId,
            location,
            redirectTo
        } = this.props

        if (this.isValidInput && !success) {
            if (option === 'email' || option === 'phone') {
                if (option === 'email') {
                    Mixpanel.track("SR Select email")
                } else {
                    Mixpanel.track("SR Select phone")
                }
                await this.handleSendCode()
                window.scrollTo(0, 0);
            } else if (option === 'phrase') {
                Mixpanel.track("SR-SP Select seed phrase")
                redirectTo(`/setup-seed-phrase/${accountId}/phrase${location.search}`)
            } else if (option === 'ledger') {
                Mixpanel.track("SR-Ledger Select ledger")
                redirectTo(`/setup-ledger/${accountId}${location.search}`)
            }
        }
    }

    get method() {
        const { phoneNumber, email, option } = this.state;

        const method = {
            kind: option === 'email' ? 'email' : 'phone',
            detail: option === 'email' ? email : phoneNumber
        }

        return method;
    }

    handleSendCode = async () => {
        Mixpanel.track("SR Send code", { send_code_detail: this.method })
        const { accountId, initializeRecoveryMethod } = this.props;
        const recoverySeedPhrase = await initializeRecoveryMethod(accountId, this.method);
        this.setState({ success: true, recoverySeedPhrase: recoverySeedPhrase })
    }

    handleSetupRecoveryMethod = async (securityCode) => {
        const {
            accountId,
            setupRecoveryMessage,
            setupRecoveryMessageNewAccount,
            location,
            showCustomAlert,
        } = this.props;

        const { recoverySeedPhrase, recaptchaToken, success } = this.state;

        if (success) {
            await Mixpanel.withTracking("SR Setup recovery method",
                async () => {
                    if (!this.state.isNewAccount) {
                        return setupRecoveryMessage(accountId, this.method, securityCode, this.state.recoverySeedPhrase)
                    }

                    const queryOptions = parseQuery(location.search);
                    const fundingOptions = JSON.parse(queryOptions.fundingOptions || 'null')

                    try {
                        await setupRecoveryMessageNewAccount(accountId, this.method, securityCode, fundingOptions, recoverySeedPhrase, recaptchaToken);

                    } catch (e) {
                        debugLog('setupRecoveryMessageNewAccount() failed', e.message);
                        if (e.message === 'Invalid code') {
                            showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.setupRecoveryMessageNewAccount.invalidCode'
                            })
                        } else if (isRetryableRecaptchaError(e)) {
                            showCustomAlert({
                                success: false,
                                messageCodeHeader: 'error',
                                messageCode: 'walletErrorCodes.invalidRecaptchaCode'
                            })
                        } else {
                            showCustomAlert({
                                errorMessage: e.message,
                                success: false,
                                messageCodeHeader: 'error',
                            })
                        }
                    }
                }
            )
        }
    }

    handleGoBack = () => {
        const { option } = this.state;
        Mixpanel.track(option === 'email' ? "SR Send to different email" : "SR Send to different phone")
        this.setState({
            email: '',
            phoneNumber: '',
            success: false
        })
    }

    handleBlurEmail = () => {
        this.setState((state) => ({
            emailInvalid: state.email !== '' && !this.isValidInput
        }))
    }

    handleBlurPhone = () => {
        this.setState((state) => ({
            phoneInvalid: state.phoneNumber !== '' && !this.isValidInput
        }))
    }

    checkDisabled = (method) => {
        const { recoveryMethods, activeAccountId } = this.props
        let activeMethods = []
        if (recoveryMethods[activeAccountId]) {
            activeMethods = recoveryMethods[activeAccountId].filter(method => method.confirmed).map(method => method.kind)
        }

        return !this.checkNewAccount() && activeMethods.includes(method)
    }

    checkNewAccount = () => {
        return this.props.accountId !== this.props.activeAccountId
    }

    handleRecaptchaChange = (recaptchaToken) => {
        debugLog('handleRecaptchaChange()', recaptchaToken)
        this.setState({ recaptchaToken })
    }

    render() {
        const { option, phoneNumber, email, success, emailInvalid, phoneInvalid, country, isNewAccount } = this.state;
        const { mainLoader, accountId, activeAccountId, ledgerKey, twoFactor } = this.props;

        if (!success) {
            return (
                <StyledContainer className='small-centered'>
                    <form onSubmit={e => {
                        this.handleNext();
                        e.preventDefault();
                    }}>
                        <h1><Translate id='setupRecovery.header'/></h1>
                        <h2><Translate id='setupRecovery.subHeader'/></h2>
                        <h4><Translate id='setupRecovery.advancedSecurity'/></h4>
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
                        <h4><Translate id='setupRecovery.basicSecurity'/></h4>
                        <RecoveryOption
                            onClick={() => {
                                this.setState({ option: 'email' });
                                setTimeout(() => {
                                    this.emailInput.current.focus();
                                }, 0)
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
                                setTimeout(() => {
                                    this.phoneInput.current.focus();
                                }, 0)
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
                            sending={actionsPending('INITIALIZE_RECOVERY_METHOD', 'SETUP_RECOVERY_MESSAGE')}
                            trackingId='SR Click submit button'
                        >
                            <Translate id='button.continue'/>
                        </FormButton>
                    </form>
                </StyledContainer>
            )
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
                    loading={mainLoader}
                    onRecaptchaChange={this.handleRecaptchaChange}
                />
            )
        }
    }
}

const mapDispatchToProps = {
    setupRecoveryMessage,
    redirectToApp,
    loadRecoveryMethods,
    initializeRecoveryMethod,
    setupRecoveryMessageNewAccount,
    getAccessKeys,
    getLedgerKey,
    get2faMethod,
    checkIsNew,
    redirectTo,
    showCustomAlert
}

const mapStateToProps = ({ account, router, recoveryMethods, status }, { match }) => ({
    ...account,
    router,
    accountId: match.params.accountId,
    activeAccountId: account.accountId,
    recoveryMethods,
    mainLoader: status.mainLoader
})

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);
