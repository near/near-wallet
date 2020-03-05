import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import LoginConfirm from './LoginConfirm'
import LoginDetails from './LoginDetails'
import LoginIncorrectContractId from './LoginIncorrectContractId'

import { refreshAccount, handleRefreshUrl, switchAccount, clearAlert, allowLogin, checkContract } from '../../actions/account'

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

    handleDeny = e => {
        e.preventDefault();
        if (this.props.account.url.failure_url) {
            window.location.href = this.props.account.url.failure_url
        }
    }

    handleAllow = () => {
        this.setState(() => ({
            buttonLoader: true
        }))

        this.props.allowLogin()
            .finally(() => {
                this.setState(() => ({
                    buttonLoader: false
                }))
            })
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount(accountId)
        this.props.refreshAccount()
    }

    redirectCreateAccount = () => {
        this.props.history.push('/create')
    }

    render() {
        const { account: { url }, match } = this.props
        // const { contractCorrect } = this.state

        return (
            <LoginContainer>
                <>
                    <Route
                        exact
                        path={`${match.url}`}
                        render={(props) => (
                            <LoginForm
                                {...this.state}
                                {...props}
                                appTitle={url && url.title}
                                contractId={url && url.contract_id}
                                handleOnClick={this.handleOnClick}
                                handleDeny={this.handleDeny}
                                handleAllow={this.handleAllow}
                                handleSelectAccount={this.handleSelectAccount}
                                redirectCreateAccount={this.redirectCreateAccount}
                                handleDetails={this.handleDetails}
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
                                appTitle={url && url.title}
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
                                appTitle={url && url.title}
                                handleAllow={this.handleAllow}
                            />
                        )}
                    />
                </>
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
    checkContract
}

const mapStateToProps = ({ account }) => ({
    account
})

export const LoginWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Login))
