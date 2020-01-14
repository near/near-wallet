import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
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
        switch (this.props.status) {
            case 'needs-confirmation':
                return <SignTransferReady {...this.state} appTitle={this.props.appTitle} handleAllow={this.handleAllow} handleDeny={this.handleDeny} handleDetails={this.handleDetails} sensitiveActionsCounter={this.props.sensitiveActionsCounter} />
            case 'in-progress':
                return <SignTransferTransferring {...this.state} totalAmount={this.props.totalAmount}/>
            case 'success':
                return <SignTransferSuccess handleDeny={this.handleDeny} totalAmount={this.props.totalAmount} />
            case 'error':
                // TODO: Figure out how to handle different error types
                return <SignTransferCancelled handleDeny={this.handleDeny} />
            //return <SignTransferInsufficientFunds handleDeny={this.handleDeny} handleAddFunds={this.handleAddFunds} />
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
    // TODO: Remove dummy data
    /*
    transactions = [
        {
            signerId: 'cryptocorgis',
            receiverId: 'account id',
            actions: [
                {
                    createAccount: {},
                },
                {
                    deployContract: {},
                },
                {
                    functionCall: {
                        methodName: 'Method Name',
                        args: [1, 2, 3],
                        gas: 123
                    },
                },
                {
                    transfer: {
                        deposit: 123
                    },
                },
                {
                    stake: {
                        stake: 123,
                        publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas'
                    },
                },
                {
                    addKey: {
                        publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas',
                        accessKey: {
                            permission: {
                                functionCall: {
                                    receiverId: 'receiver id'
                                }
                            }
                        }
                    },
                },
                {
                    deleteKey: {
                        publicKey: 'dasdasadsdasdasadsadsadsdsaadsdas'
                    },
                },
                {
                    deleteAccount: {},
                }
            ]
        },
        {
            signerId: 'cryptocorgis',
            receiverId: 'account id',
            actions: [
                {
                    deployContract: {}
                },
                {
                    functionCall: {
                        methodName: 'Method Name',
                        args: [1, 2, 3],
                        gas: 123
                    },
                },
            ]
        }
    ]
    */

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
