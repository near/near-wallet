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

    handleAllow = async () => {
        await this.props.signAndSendTransactions(this.props.transactions, this.props.account.accountId)
        console.log('came back')
        if (this.props.callbackUrl) {
            window.location.href = this.props.callbackUrl;
        }
    }

    renderSubcomponent = () => {
        const { account: { url, balance }, totalAmount, sensitiveActionsCounter, status } = this.props

        const txTotalAmount = new BN(totalAmount); // TODO: add gas cost, etc
        const availableBalance = new BN(balance.available);
        const insufficientFunds = txTotalAmount.gt(availableBalance);
        const isMonetaryTransaction = txTotalAmount.gt(new BN(0));

        switch (status) {
            case 'needs-confirmation':
                return <SignTransferReady
                            {...this.state}
                            appTitle={url && url.referrer}
                            handleAllow={this.handleAllow}
                            handleDeny={this.handleDeny}
                            handleDetails={this.handleDetails}
                            sensitiveActionsCounter={sensitiveActionsCounter}
                            txTotalAmount={txTotalAmount}
                            availableBalance={availableBalance}
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
                return <b><Translate id='sign.unexpectedStatus' />: {status}</b>
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

const mapStateToProps = ({ account, sign }) => ({
    account,
    ...sign
})

export const SignWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Sign))
