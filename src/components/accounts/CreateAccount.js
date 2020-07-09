import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts, setFormLoader } from '../../actions/account'
import { ACCOUNT_ID_SUFFIX, setTempAccount } from '../../utils/wallet'

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        token: '',
        recaptchaFallback: false
    }

    componentDidMount = () => {
        const { loginError, resetAccounts } = this.props;

        if (loginError) {
            console.error('Error loading account:', loginError)

            if (loginError.indexOf('does not exist while viewing') !== -1) {
                resetAccounts()
            }
        }
    }

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleChange = (e, { name, value }) => {
        if (value.length > 0) {
            this.setState({[name]: `${value}.${ACCOUNT_ID_SUFFIX}`})
        } else {
            this.setState({[name]: value})
        }
    }

    handleCreateAccount = () => {
        const { accountId, token } = this.state;
        const { match, createNewAccount, setFormLoader } = this.props

        const fundingKey = match.params.fundingKey;
        const fundingContract = match.params.fundingContract;
        let nextUrl = `/set-recovery/${accountId}`;
        if (fundingKey && fundingContract) {
            nextUrl = `/set-recovery/${accountId}/${fundingContract}/${fundingKey}`;
        }
        
        setTempAccount(accountId)
        setFormLoader(false)
        this.props.history.push(nextUrl)
        
    }

    render() {
        const { loader, accountId, recaptchaFallback } = this.state
        const { requestStatus, formLoader, checkNewAccount, location, loginResetAccounts, clear, setFormLoader } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <AccountFormContainer
                location={this.props.location}
                title={<Translate id='createAccount.pageTitle' />}
                text={<Translate id='createAccount.pageText' />}
                loginResetAccounts={loginResetAccounts}
            >
                <AccountFormSection 
                    handleSubmit={this.handleCreateAccount}
                    location={location}
                >
                    <CreateAccountForm
                        loader={loader}
                        requestStatus={useRequestStatus}
                        formLoader={formLoader}
                        handleChange={this.handleChange}
                        recaptchaFallback={recaptchaFallback}
                        verifyRecaptcha={token => this.setState({ token: token }, this.handleCreateAccount)}
                        checkAvailability={checkNewAccount}
                        accountId={accountId}
                        clearRequestStatus={clear}
                        setFormLoader={setFormLoader}
                    />
                    <GoogleReCaptchaProvider reCaptchaKey="6LfSgNoUAAAAABKb2sk4Rs3TS0RMx9zrVwyTBSc6">
                        <GoogleReCaptcha onVerify={token => this.setState({ token: token })}/>
                    </GoogleReCaptchaProvider>
                </AccountFormSection>
            </AccountFormContainer>
        )
    }
}

const mapDispatchToProps = {
    checkNewAccount,
    createNewAccount,
    clear,
    refreshAccount,
    resetAccounts,
    setFormLoader
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
