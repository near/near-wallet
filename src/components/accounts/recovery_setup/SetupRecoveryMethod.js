import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../../utils/account';
import { 
    initializeRecoveryMethod, 
    setupRecoveryMessage,
    setupRecoveryMessageNewAccount, 
    redirectToApp, 
    loadRecoveryMethods, 
    getAccessKeys, 
    getLedgerKey,
    get2faMethod,
    checkIsNew } from '../../../actions/account';
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

    h4 {
        margin-top: 40px;
    }

`

const OptionSubHeader = styled.div`
    margin-top: 10px;
    max-width: 540px;
    line-height: 150%;
`

class SetupRecoveryMethod extends Component {

    state = {
        option: 'phrase',
        phoneNumber: '',
        email: '',
        success: false,
        emailInvalid: false,
        phoneInvalid: false,
        recoverySeedPhrase: null
    }

    componentDidMount() {
        const { router } = this.props;
        const { method } = router.location;

        if (method) {
            this.setState({ option: method });
        }

        if (this.props.activeAccountId) {
            this.props.loadRecoveryMethods()
            this.props.getLedgerKey()
            this.props.get2faMethod()
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

        const {
            accountId, fundingContract, fundingKey,
        } = this.props
        const phraseUrl = `/setup-seed-phrase/${accountId}/phrase/${fundingContract ? `${fundingContract}/${fundingKey}/` : ``}`

        if (option === 'email' || option === 'phone') {
            this.handleSendCode()
            window.scrollTo(0, 0);
        } else if (option === 'phrase') {
            this.props.history.push(phraseUrl);
        } else if (option === 'ledger') {
            const ledgerUrl = `/setup-ledger/${accountId}/${fundingContract ? `${fundingContract}/${fundingKey}/` : ``}`
            this.props.history.push(ledgerUrl);
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
        const  { accountId, initializeRecoveryMethod } = this.props;
        const recoverySeedPhrase = await initializeRecoveryMethod(accountId, this.method);
        this.setState({ success: true, recoverySeedPhrase: recoverySeedPhrase })
    }

    handleSetupRecoveryMethod = async (securityCode) => {
        const  {
            accountId, setupRecoveryMessage,
            fundingContract, fundingKey, checkIsNew,
            setupRecoveryMessageNewAccount
        } = this.props;

        const isNew = await checkIsNew(accountId)
        if (isNew) {
            await setupRecoveryMessageNewAccount(accountId, this.method, securityCode, fundingContract, fundingKey, this.state.recoverySeedPhrase)
        } else {
            await setupRecoveryMessage(accountId, this.method, securityCode, this.state.recoverySeedPhrase)
        }
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

    checkDisabled = (method) => {
        const { recoveryMethods, activeAccountId, accountId } = this.props
        let activeMethods = []
        if (recoveryMethods[activeAccountId]) {
            activeMethods = recoveryMethods[activeAccountId].filter(method => method.confirmed).map(method => method.kind)
        }
        
        return accountId === activeAccountId && activeMethods.includes(method)
    }

    render() {
        const { option, phoneNumber, email, success, emailInvalid, phoneInvalid } = this.state;
        const { actionsPending, accountId, activeAccountId, ledgerKey, twoFactor } = this.props;

        if (!success) {
            return (
                <StyledContainer className='small-centered'>
                    <form onSubmit={e => {this.handleNext(); e.preventDefault();}}>
                        <h1><Translate id='setupRecovery.header'/></h1>
                        <h2><Translate id='setupRecovery.subHeader'/></h2>
                        <h4><Translate id='setupRecovery.advancedSecurity'/></h4>
                        <OptionSubHeader><Translate id='setupRecovery.advancedSecurityDesc'/></OptionSubHeader>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'phrase' })}
                            option='phrase'
                            active={option}
                            disabled={this.checkDisabled('phrase')}
                        />
                        {
                            !twoFactor &&
                            <RecoveryOption
                                onClick={() => this.setState({ option: 'ledger' })}
                                option='ledger'
                                active={option}
                                disabled={ledgerKey !== null && accountId === activeAccountId}
                            />
                        }
                        <h4><Translate id='setupRecovery.basicSecurity'/></h4>
                        <OptionSubHeader><Translate id='setupRecovery.basicSecurityDesc'/></OptionSubHeader>
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'email' })}
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
                            disabled={this.checkDisabled('phone')}
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
                    loading={actionsPending.some(action => ['SETUP_RECOVERY_MESSAGE', 'SETUP_RECOVERY_MESSAGE_NEW_ACCOUNT'].includes(action))}
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
    initializeRecoveryMethod,
    setupRecoveryMessageNewAccount,
    getAccessKeys,
    getLedgerKey,
    get2faMethod,
    checkIsNew
}

const mapStateToProps = ({ account, router, recoveryMethods }, { match }) => ({
    ...account,
    router,
    accountId: match.params.accountId,
    activeAccountId: account.accountId,
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
    recoveryMethods
})

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);
