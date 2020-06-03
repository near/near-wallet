import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts, setFormLoader } from '../../actions/account'
import { ACCOUNT_ID_SUFFIX } from '../../utils/wallet'
import Container from '../common/styled/Container.css'
import ReCAPTCHA from 'react-google-recaptcha'

import FormButton from '../common/FormButton'
import AccountFormAccountId from './AccountFormAccountId'
import AccountNote from '../common/AccountNote'

const StyledContainer = styled(Container)`

    .input {
        width: 100%;
    }

    button {
        :first-of-type {
            width: 100% !important;
        }
    }

    h6 {
        margin: 30px 0 5px 0 !important;
        font-size: 15px !important;
        color: #24272a;
        letter-spacing: normal !important;
    }

    .recaptcha-disclaimer {
        font-size: 12px;
        font-weight: 400;
        max-width: 383px;
        margin: 50px auto 0 auto;
        text-align: center;

        a {
            color: inherit;
        }
    }

    a {
        text-decoration: underline;
    }
    
    .alternatives-title {
        color: #24272a;
        text-align: center;
        margin-top: 30px;
    }

    .alternatives {
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }

`

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

        this.setState({ loader: true });
        
        createNewAccount(accountId, fundingKey, fundingContract, token)
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
        
        setFormLoader(false)
    }

    handleCreateAccountSuccess = () => {
        const { accountId } = this.state;

        this.props.refreshAccount();
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ? `/setup-seed-phrase/${accountId}` : `/set-recovery/${accountId}`;
        this.props.history.push(nextUrl);
    }

    render() {
        const { loader, accountId, recaptchaFallback } = this.state
        const { requestStatus, formLoader, checkNewAccount, loginResetAccounts, clear, setFormLoader } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;

        return (
            <StyledContainer className='small-centered'>
                <form onSubmit={e => {this.handleCreateAccount(); e.preventDefault();}} autoComplete='off'>
                    <h1><Translate id='createAccount.pageTitle'/></h1>
                    <h2>Just choose a username and you're all set!</h2>
                    {loginResetAccounts &&
                        <h3 className='color-blue'>
                            You have been redirected to this page because we had to reset the developer accounts. Please create a new account. We apologize for the inconveience.
                        </h3>
                    }
                    <h6><Translate id='createAccount.accountIdInput.title'/></h6>
                    <AccountFormAccountId
                        formLoader={formLoader}
                        handleChange={this.handleChange}
                        type='create'
                        pattern={/[^a-zA-Z0-9_-]/}
                        checkAvailability={checkNewAccount}
                        requestStatus={useRequestStatus}
                        accountId={accountId}
                        clearRequestStatus={clear}
                        setFormLoader={setFormLoader}
                    />
                    <AccountNote/>
                    <FormButton
                        type='submit'
                        disabled={!(requestStatus && requestStatus.success)}
                        sending={loader}
                    >
                        <Translate id='button.createAccountCapital'/>
                    </FormButton>
                    {recaptchaFallback &&
                        <ReCAPTCHA
                            sitekey='6LcZJtsUAAAAAN0hXzam-vEAPiFKMVsFY75Mn8AT'
                            onChange={token => this.setState({ token: token }, this.handleCreateAccount)}
                            style={{ marginTop: '25px' }}
                        />
                    }
                    <div className='alternatives-title'><Translate id='createAccount.alreadyHaveAnAccount'/></div>
                    <div className='alternatives'>
                        <Link to='sign-in-ledger'><Translate id='createAccount.signInLedger'/></Link>
                        &nbsp;or&nbsp;
                        <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
                    </div>
                    <div className='recaptcha-disclaimer'>
                        This site is protected by reCAPTCHA and the Google <a href='https://policies.google.com/privacy' target='_blank' rel='noopener noreferrer'>Privacy Policy</a> and <a href='https://policies.google.com/terms' target='_blank' rel='noopener noreferrer'>Terms of Service</a> apply.
                    </div>
                    <GoogleReCaptchaProvider reCaptchaKey="6LfSgNoUAAAAABKb2sk4Rs3TS0RMx9zrVwyTBSc6">
                        <GoogleReCaptcha onVerify={token => this.setState({ token: token })}/>
                    </GoogleReCaptchaProvider>
                </form>
            </StyledContainer>
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
