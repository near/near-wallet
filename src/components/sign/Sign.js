import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import BN from 'bn.js'
import { Translate } from 'react-localize-redux'

import SignContainer from './SignContainer'
import SignTransferReady from './SignTransferReady'
import SignTransferSuccess from './SignTransferSuccess'
import SignTransferCancelled from './SignTransferCancelled'
import SignTransferTransferring from './SignTransferTransferring'
import { signAndSendTransactions } from '../../actions/account'

class Sign extends Component {

    handleDeny = e => {
        e.preventDefault();
        // TODO: Dispatch action for app redirect?
        if (this.props.callbackUrl) {
            window.location.href = this.props.callbackUrl;
        }
    }

    handleAddFunds = () => {
        // TODO: Should this use Redux action to navigate
        this.props.push(`/profile/${this.props.account.accountId}`)
    }

    handleAllow = e => {
        this.props.signAndSendTransactions(this.props.transactions, this.props.account.accountId)
            .then(({ error }) => {
                if (!error && this.props.callbackUrl) {
                    window.location.href = this.props.callbackUrl;
                }
            });
    }

    renderSubcomponent = () => {

        const txTotalAmount = new BN(this.props.totalAmount); // TODO: add gas cost, etc
        const accountBalance = new BN(this.props.account.amount);
        const insufficientFunds = txTotalAmount.gt(accountBalance);
        const isMonetaryTransaction = txTotalAmount.gt(new BN(0));

        switch (this.props.status) {
            case 'needs-confirmation':
                return <SignTransferReady
                            {...this.state}
                            appTitle={this.props.appTitle}
                            handleAllow={this.handleAllow}
                            handleDeny={this.handleDeny}
                            handleDetails={this.handleDetails}
                            sensitiveActionsCounter={this.props.sensitiveActionsCounter}
                            txTotalAmount={txTotalAmount}
                            accountBalance={accountBalance}
                            insufficientFunds={insufficientFunds}
                            isMonetaryTransaction={isMonetaryTransaction}
                        />
            case 'in-progress':
                return <SignTransferTransferring
                            {...this.state}
                            isMonetaryTransaction={isMonetaryTransaction}
                        />
            case 'success':
                return <SignTransferSuccess
                            handleDeny={this.handleDeny}
                            isMonetaryTransaction={isMonetaryTransaction}
                            txTotalAmount={txTotalAmount}
                        />
            case 'error':
                // TODO: Figure out how to handle different error types
                return <SignTransferCancelled handleDeny={this.handleDeny} />
            default:
                return <b><Translate id='sign.unexpectedStatus' />: {this.props.status}</b>
        }
    }

    render() {
        return <SignContainer>{this.renderSubcomponent()}</SignContainer>;
    }
}

const mapDispatchToProps = {
    signAndSendTransactions,
    push
}

const mapStateToProps = ({ account, sign }) => {

    // NOTE: Referrer won't be set properly in local dev environment. Underlying reason unknown.
    const { referrer } = account.url
    let referrerDomain;
    if (referrer) {
        const referrerUrl = new URL(account.url.referrer)
        referrerDomain = referrerUrl.hostname
    }

    return {
        account,
        appTitle: referrerDomain,
        ...sign
    }
}

export const SignWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Sign))
