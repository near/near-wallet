import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BN from 'bn.js'
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
        if (this.props.account.url.callback) {
            window.location.href = this.props.account.url.callback
        }
    }

    handleAddFunds = () => {
        this.props.history.push('/profile')
    }

    handleAllow = e => {
        // TODO: Submit transaction for real
        // TODO: Remove all setState garbage
        // TODO: Update status in reducer?

        // TODO: Redirect immediately if submitting transaction isn't desired

        this.props.signAndSendTransactions(this.props.transactions, this.props.account.accountId);
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
                return <b>Unexpected status: {this.props.status}</b>
        }
    }

    render() {
        return <SignContainer>{this.renderSubcomponent()}</SignContainer>;
    }
}

const mapDispatchToProps = {
    signAndSendTransactions
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
