import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts, setFormLoader } from '../../actions/account'
import { ACCOUNT_ID_SUFFIX, setTempAccount, setLinkdropData } from '../../utils/wallet'
import Container from '../common/styled/Container.css'

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
        token: ''
    }

    componentDidMount = () => {
        const { loginError, resetAccounts } = this.props;

        if (loginError) {
            // console.error('Error loading account:', loginError)

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

    handleCreateAccount = async () => {
        const { accountId, token } = this.state;
        const { match, createNewAccount, setFormLoader } = this.props

        const fundingContract = match.params.fundingContract;
        const fundingKey = match.params.fundingKey;
        // arrived from a linkdrop link
        if (fundingContract && fundingKey) {
            setLinkdropData({ fundingContract, fundingKey })
        } else {
            // not a linkdrop link, clear any existing linkdrop data (if any)
            setLinkdropData({})
        }
        
        
        setTempAccount(accountId)
        setFormLoader(false)
        
        this.setState({ loader: true });
        let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ? `/setup-seed-phrase/${accountId}` : `/set-recovery/${accountId}`;
        this.props.history.push(nextUrl);

        /********************************
        Deprecated create account here in favor of creating account after recovery is confirmed
        ********************************/

    //     try {
    //         await createNewAccount(accountId, fundingKey, fundingContract, token)
    //     } finally {
    //         this.setState({ loader: false });
    //         setFormLoader(false)
    //     }
        
    //     this.handleCreateAccountSuccess();
    // }

    // handleCreateAccountSuccess = () => {
    //     const { accountId } = this.state;

    //     this.props.refreshAccount();
    //     let nextUrl = process.env.DISABLE_PHONE_RECOVERY === 'yes' ? `/setup-seed-phrase/${accountId}` : `/set-recovery/${accountId}`;
    //     this.props.history.push(nextUrl);
    // }

    }

    render() {
        const { loader, accountId, recaptchaFallback } = this.state
        const { requestStatus, formLoader, checkNewAccount, resetAccount, clear, setFormLoader } = this.props
        const useRequestStatus = accountId.length > 0 ? requestStatus : undefined;
        
        return (
            <StyledContainer className='small-centered'>
                <form onSubmit={e => {this.handleCreateAccount(); e.preventDefault();}} autoComplete='off'>
                    <h1><Translate id='createAccount.pageTitle'/></h1>
                    <h2>Just choose a username and you're all set!</h2>
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
                        defaultAccountId={resetAccount && resetAccount.accountIdNotConfirmed.split('.')[0]}
                    />
                    <AccountNote/>
                    <FormButton
                        type='submit'
                        disabled={!(requestStatus && requestStatus.success)}
                        sending={loader}
                    >
                        <Translate id='button.createAccountCapital'/>
                    </FormButton>
                    <div className='alternatives-title'><Translate id='createAccount.alreadyHaveAnAccount'/></div>
                    <div className='alternatives'>
                        <Link to='/sign-in-ledger'><Translate id='createAccount.signInLedger'/></Link>
                        &nbsp;or&nbsp;
                        <Link to={process.env.DISABLE_PHONE_RECOVERY === 'yes' ? '/recover-seed-phrase' : '/recover-account'}><Translate id='createAccount.recoverItHere' /></Link>
                    </div>
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
