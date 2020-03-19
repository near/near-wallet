import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts } from '../../actions/account'

class CreateAccount extends Component {
    state = {
        loader: false,
        accountId: '',
        token: '',
        recaptchaFallback: false
    }

    componentDidMount = () => {
        const { loginError, resetAccounts } = this.props

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
        this.setState(() => ({
            [name]: value
        }))
    }

    handleCreateAccount = () => {
        const { accountId, token } = this.state;

        this.setState({ loader: true });
        this.props.createNewAccount(accountId, token)
        .then(({ error, payload }) => {
            if (error) {
                if (payload.statusCode === 402) {
                    this.setState({ recaptchaFallback: true });
                }
                this.setState({ loader: false });
                return;
            }

            this.handleCreateAccountSuccess();
        });
    }

    handleCreateAccountSuccess = () => {
        const { accountId } = this.state;

        this.props.refreshAccount();
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ? `/setup-seed-phrase/${accountId}` : `/set-recovery/${accountId}`;
        this.props.history.push(nextUrl);
        this.setState({ loader: false });
    }

    render() {
        const { loader, accountId, recaptchaFallback } = this.state
        const { requestStatus, formLoader, checkNewAccount, location, loginResetAccounts } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <AccountFormContainer 
                location={this.props.location}
                title={<Translate id='createAccount.pageTitle' />}
                text={<Translate id='createAccount.pageText' />}
                loginResetAccounts={loginResetAccounts}
            >
                <AccountFormSection 
                    requestStatus={useRequestStatus}
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
    resetAccounts
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const CreateAccountWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAccount)
