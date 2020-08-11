import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Translate } from 'react-localize-redux';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../../utils/account';
import { initializeRecoveryMethod, setupRecoveryMessage, redirectToApp, loadRecoveryMethods, getAccessKeys, getLedgerKey, refreshAccount } from '../../../actions/account';
import RecoveryOption from './RecoveryOption';
import FormButton from '../../common/FormButton';
import EnterVerificationCode from '../EnterVerificationCode';
import Container from '../../common/styled/Container.css';
import { MULTISIG_MIN_AMOUNT } from '../../../utils/wallet';
import { formatNEAR } from '../../common/Balance';
import { BN } from 'bn.js';
import { utils } from 'near-api-js';

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
        activeMethods: [],
        hasFetchedMethods: false
    }

    componentDidMount() {
        const { router, getAccessKeys, getLedgerKey, isNew } = this.props;
        const { method } = router.location;
        
        getAccessKeys()
        getLedgerKey()

        if (method) {
            this.setState({ option: method });
        }

        if (!isNew) {
            this.setRecoveryMethods()
        }
    }

    setRecoveryMethods = () => {
        if (this.props.recoveryMethods[this.props.activeAccountId]) {
            const confirmed = this.props.recoveryMethods[this.props.accountId].filter(method => method.confirmed)
            this.setState({ activeMethods: confirmed.map(method => method.kind) });
        } else {
            if (!this.state.hasFetchedMethods) {
                this.getMethods()
            }
        }
    }

    getMethods = async () => {

        await this.props.loadRecoveryMethods()
        this.setState({ hasFetchedMethods: true })
        return this.setRecoveryMethods()
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
            isNew, accountId, fundingContract, fundingKey,
        } = this.props
        const phraseUrl = `/setup-seed-phrase/${accountId}/phrase/${isNew ? '1' : '0'}/${fundingContract ? `${fundingContract}/${fundingKey}/` : ``}`

        if (option === 'email' || option === 'phone') {
            this.handleSendCode()
            window.scrollTo(0, 0);
        } else if (option === 'phrase') {
            this.props.history.push(phraseUrl);
        } else if (option === 'ledger') {
            const ledgerUrl = `/setup-ledger/${accountId}/${isNew ? '1' : '0'}/${fundingContract ? `${fundingContract}/${fundingKey}/` : ``}`
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

    handleSendCode = () => {
        const  { accountId, initializeRecoveryMethod, isNew } = this.props;

        initializeRecoveryMethod(accountId, this.method, isNew);
        this.setState({ success: true })
        
    }

    handleSetupRecoveryMethod = async (securityCode) => {
        const  {
            accountId, setupRecoveryMessage, redirectToApp, history,
            isNew, fundingContract, fundingKey, refreshAccount
        } = this.props;

        let account;

        try {
            await setupRecoveryMessage(accountId, this.method, securityCode, isNew, fundingContract, fundingKey)
            account = await refreshAccount()
        } finally {
            const availableBalance = new BN(account.balance.available)
            const multisigMinAmount = new BN(utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT))

            if (fundingContract && multisigMinAmount.lt(availableBalance)) {
                history.push('/enable-two-factor')
            } else {
                redirectToApp('/profile');
            }
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

    render() {
        const { option, phoneNumber, email, success, emailInvalid, phoneInvalid, activeMethods } = this.state;
        const { actionsPending, accountId, activeAccountId, ledgerKey } = this.props;

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
                            disabled={ledgerKey !== null && accountId === activeAccountId}
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
    initializeRecoveryMethod,
    getAccessKeys,
    getLedgerKey,
    refreshAccount
}

const mapStateToProps = ({ account, router, recoveryMethods }, { match }) => ({
    ...account,
    router,
    accountId: match.params.accountId,
    activeAccountId: account.accountId,
    isNew: !!parseInt(match.params.isNew),
    fundingContract: match.params.fundingContract,
    fundingKey: match.params.fundingKey,
    recoveryMethods
})

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetupRecoveryMethod);
