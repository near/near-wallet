import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../../utils/account';
import { initializeRecoveryMethodForTempAccount, setupRecoveryMessage, redirectToApp, loadRecoveryMethods, getAccessKeys } from '../../../actions/account';
import RecoveryOption from './RecoveryOption';
import FormButton from '../../common/FormButton';
import EnterVerificationCode from '../EnterVerificationCode';
import Container from '../../common/styled/Container.css';

const StyledContainer = styled(Container)`
    
    button {
        text-transform: uppercase !important;
        margin-top: 50px !important;
        width: 100% !important;
    }

`

const OptionHeader = styled.h4`
    margin-top: 40px;
`

const OptionSubHeader = styled.div`
    margin-top: 10px;
    max-width: 540px;
    line-height: 150%;
`

class SetupRecoveryMethod extends Component {

    state = {
        option: 'email',
        phoneNumber: '',
        email: '',
        success: false,
        emailInvalid: false,
        phoneInvalid: false,
        activeMethods: []
    }

    componentDidMount() {
        const { loadRecoveryMethods, accountId, router, recoveryMethods, getAccessKeys } = this.props;
        const { method } = router.location;

        getAccessKeys()

        if (method) {
            this.setState({ option: method });
        }

        if (recoveryMethods[accountId]) {
            const confirmed = recoveryMethods[accountId].filter(method => method.confirmed)
            this.setState({ activeMethods: confirmed.map(method => method.kind) });
        } else {
            loadRecoveryMethods(accountId)
                .then(({ payload }) => {
                    if (!payload.data) {
                        this.setState({ activeMethods: [] });
                        return;
                    }
                    const confirmed = payload.data.filter(method => method.confirmed);
                    this.setState({ activeMethods: confirmed.map(method => method.kind) });
                })
        }
    }

    get isValidInput() {
        const { option, phoneNumber, email } = this.state;

        switch (option) {
            case 'email':
                return validateEmail(email)
            case 'phone':
                return isValidPhoneNumber(phoneNumber)
            case 'phrase':
                return true
            case 'ledger':
                return true
            default:
                return false
        }
    }

    handleNext = () => {
        const { option } = this.state;

        if (option === 'email' || option === 'phone') {
            this.handleSendCode()
            window.scrollTo(0, 0);
        } else if (option === 'phrase') {
            this.props.history.push(`/setup-seed-phrase/${this.props.accountId}`);
        } else if (option === 'ledger') {
            this.props.history.push(`/setup-ledger`);
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

    handleSendCode = () => {
        const  { accountId, initializeRecoveryMethodForTempAccount } = this.props;

        initializeRecoveryMethodForTempAccount(accountId, this.method);
        this.setState({ success: true })
        
    }

    handleSetupRecoveryMethod = (securityCode) => {
        const  { accountId, setupRecoveryMessage, redirectToApp, match } = this.props;

        const fundingContract = match.params.fundingContract;
        const fundingKey = match.params.fundingKey;

        console.log(fundingContract, fundingKey)

        setupRecoveryMessage(accountId, this.method, securityCode, fundingContract, fundingKey)
            .then(({ error }) => {
                if (error) return;
                redirectToApp('/profile');
            })
    }

    handleGoBack = () => {
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

    render() {
        const { option, phoneNumber, email, success, emailInvalid, phoneInvalid, activeMethods } = this.state;
        const { actionsPending, fullAccessKeys } = this.props;

        const keys = fullAccessKeys || [];
        const ledgerKey = keys.find(key => key.meta.type === 'ledger');
        const hasLedger = !!ledgerKey // TODO: reference a global hasLedger variable and share with HardwareDevices.js

        if (!success) {
            return (
                <StyledContainer className='small-centered'>
                    <form onSubmit={e => {this.handleNext(); e.preventDefault();}}>
                        <h1><Translate id='setupRecovery.header'/></h1>
                        <h2><Translate id='setupRecovery.subHeader'/></h2>
                        <OptionHeader><Translate id='setupRecovery.basicSecurity'/></OptionHeader>
                        <OptionSubHeader><Translate id='setupRecovery.basicSecurityDesc'/></OptionSubHeader>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'email' })}
                            option='email'
                            active={option}
                            disabled={activeMethods.includes('email')}
                            problem={option === 'email' && emailInvalid}
                        >
                            <Translate>
                                {({ translate }) => (
                                    <input 
                                        type='email'
                                        placeholder={translate('setupRecovery.emailPlaceholder')}
                                        value={email}
                                        onChange={e => this.setState({ email: e.target.value, emailInvalid: false })}
                                        onBlur={this.handleBlurEmail}
                                        tabIndex='1'
                                    />
                                )}
                            </Translate>
                        </RecoveryOption>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'phone' })}
                            option='phone'
                            active={option}
                            disabled={activeMethods.includes('phone')}
                            problem={option === 'phone' && phoneInvalid}
                        >
                            <Translate>
                                {({ translate }) => (
                                    <PhoneInput
                                        placeholder={translate('setupRecovery.phonePlaceholder')}
                                        value={phoneNumber}
                                        onChange={value => this.setState({ phoneNumber: value, phoneInvalid: false })}
                                        tabIndex='1'
                                        onBlur={this.handleBlurPhone}
                                    />
                                )}
                            </Translate>
                        </RecoveryOption>
                        <OptionHeader><Translate id='setupRecovery.advancedSecurity'/></OptionHeader>
                        <OptionSubHeader><Translate id='setupRecovery.advancedSecurityDesc'/></OptionSubHeader>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'ledger' })}
                            option='ledger'
                            active={option}
                            disabled={hasLedger}
                        />
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'phrase' })}
                            option='phrase'
                            active={option}
                            disabled={activeMethods.includes('phrase')}
                        />
                        <FormButton
                            color='blue'
                            type='submit'
                            disabled={!this.isValidInput}
                            sending={actionsPending.includes('INITIALIZE_RECOVERY_METHOD')}
                        >
                            <Translate id={`button.${option !== 'phrase' ? 'protectAccount' : 'setupPhrase'}`}/>
                        </FormButton>
                    </form>
                </StyledContainer>
            )
        } else {
            return (
                <EnterVerificationCode
                    option={option}
                    phoneNumber={phoneNumber}
                    email={email}
                    onConfirm={this.handleSetupRecoveryMethod}
                    onGoBack={this.handleGoBack}
                    onResend={this.handleSendCode}
                    loading={actionsPending.includes('SETUP_RECOVERY_MESSAGE')}
                    requestStatus={this.props.requestStatus}
                />
            )
        }
    }
}

const mapDispatchToProps = {
    setupRecoveryMessage,
    redirectToApp,
    loadRecoveryMethods,
    initializeRecoveryMethodForTempAccount,
    getAccessKeys
}

const mapStateToProps = ({ account, router, recoveryMethods }, { match }) => ({
    ...account,
    router,
    accountId: match.params.accountId,
    recoveryMethods
})

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);
