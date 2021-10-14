import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { LOCKUP_ACCOUNT_ID_SUFFIX } from '../../../config/settings';
import { Mixpanel } from '../../mixpanel/index';
import { handleRefreshUrl, switchAccount, allowLogin, redirectToApp } from '../../redux/actions/account';
import { clearLocalAlert } from '../../redux/actions/status';
import { selectAccountSlice, selectAccountUrlReferrer } from '../../redux/slices/account';
import LoginConfirm from './LoginConfirm';
import LoginContainer from './LoginContainer';
import LoginDetails from './LoginDetails';
import LoginForm from './LoginForm';
import LoginIncorrectContractId from './LoginIncorrectContractId';

class Login extends Component {
    state = {
        buttonLoader: false,
        dropdown: false
    }

    handleOnClick = () => {
        this.setState({
            dropdown: !this.state.dropdown
        });
    }

    handleDeny = () => {
        const failureUrl = this.props.account.url.failure_url;
        Mixpanel.track("LOGIN Click deny button");

        if (failureUrl) {
            window.location.href = failureUrl;
        } else {
            this.props.redirectToApp();
        }
    }

    handleAllow = async () => {
        this.setState(() => ({
            buttonLoader: true
        }));

        await Mixpanel.withTracking("LOGIN",
            async () => await this.props.allowLogin(),
            () => {},
            () => this.setState(() => ({
                buttonLoader: false
            }))
        );
    }

    handleSelectAccount = accountId => {
        this.props.switchAccount({ accountId });
    }

    redirectCreateAccount = () => {
        Mixpanel.track("LOGIN Click create new account button");
        this.props.history.push('/create');
    }

    get shouldRenderAccountConfirmationForm() {
        const { account: { url, accountId } } = this.props;

        if (!url) {
            return undefined;
        }

        if (url.public_key) {
            if (!url.contract_id || url.contract_id?.endsWith(`.${LOCKUP_ACCOUNT_ID_SUFFIX}`)) {
                return true;
            } 
        }

        if (accountId) {
            return url.contract_id === accountId;
        }

        return false;
    }

    render() {
        const { account: { url }, match, appTitle } = this.props;
        
        if (this.shouldRenderAccountConfirmationForm === undefined) {
            return false;
        }

        const requestAccountIdOnly = !url.public_key && !url.contract_id;

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
                            accountConfirmationForm={this.shouldRenderAccountConfirmationForm}
                            requestAccountIdOnly={requestAccountIdOnly}
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
                            accountConfirmationForm={this.shouldRenderAccountConfirmationForm}
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
        );
    }
}

const mapDispatchToProps = {
    handleRefreshUrl,
    switchAccount,
    allowLogin,
    redirectToApp,
    clearLocalAlert
};

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    appTitle: selectAccountUrlReferrer(state)
});

export const LoginWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Login));
