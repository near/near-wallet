import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import LoginConfirm from './LoginConfirm'
import LoginDetails from './LoginDetails'
import LoginIncorrectContractId from './LoginIncorrectContractId'
import { refreshAccount, handleRefreshUrl, switchAccount, clearAlert, allowLogin, redirectToApp, clear } from '../../actions/account'
import { LOCKUP_ACCOUNT_ID_SUFFIX } from '../../utils/wallet'

class Login extends Component {
    state = {
        buttonLoader: false,
        dropdown: false
    }

    handleOnClick = () => {
        this.setState({
            dropdown: !this.state.dropdown
        })
    }

    handleDeny = () => {
        const failureUrl = this.props.account.url.failure_url;

        if (failureUrl) {
            window.location.href = failureUrl;
        } else {
            this.props.redirectToApp();
        }
    }

    handleAllow = async () => {
        this.setState(() => ({
            buttonLoader: true
        }))

        try {
            await this.props.allowLogin()
        } finally {
            this.setState(() => ({
                buttonLoader: false
            }))
        }
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.refreshAccount()
    }

    redirectCreateAccount = () => {
        this.props.history.push('/create')
    }

    render() {
        const { account: { url }, match, appTitle } = this.props
        const accountConfirmationForm = !url?.contract_id || url?.contract_id.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)

        return (
            <LoginContainer>
                <Route
                    exact
                    path={`${match.url}`}
                    render={(props) => (
                        <LoginForm
                            {...this.state}
                            {...props}
                            appTitle={appTitle}
                            handleOnClick={this.handleOnClick}
                            handleDeny={this.handleDeny}
                            handleAllow={this.handleAllow}
                            handleSelectAccount={this.handleSelectAccount}
                            redirectCreateAccount={this.redirectCreateAccount}
                            handleDetails={this.handleDetails}
                            accountConfirmationForm={accountConfirmationForm}
                        />
                    )}
                />
                <Route 
                    exact
                    path={`${match.url}/details`}
                    render={(props) => (
                        <LoginDetails
                            {...props}
                            contractId={url && url.contract_id}
                            appTitle={appTitle}
                            accountConfirmationForm={accountConfirmationForm}
                        />
                    )}
                />
                <Route 
                    exact
                    path={`${match.url}/confirm`}
                    render={(props) => (
                        <LoginConfirm
                            {...props}
                            buttonLoader={this.state.buttonLoader}
                            appTitle={appTitle}
                            handleAllow={this.handleAllow}
                        />
                    )}
                />
                <Route 
                    exact
                    path={`${match.url}/incorrect-contract-id`}
                    render={() => (
                        <LoginIncorrectContractId
                            contractId={url.contract_id}
                            failureUrl={url.failure_url}
                        />
                    )}
                />
            </LoginContainer>
        )
    }
}

const mapDispatchToProps = {
    refreshAccount,
    handleRefreshUrl,
    switchAccount,
    allowLogin,
    clearAlert,
    redirectToApp,
    clear
}

const mapStateToProps = ({ account }) => ({
    account,
    appTitle: account.url?.referrer
})

export const LoginWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Login))
