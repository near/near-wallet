import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import SignContainer from './SignContainer'
import SignTransferReady from './SignTransferReady';
import SignTransferSuccess from './SignTransferSuccess';
import SignTransferCancelled from './SignTransferCancelled';
import SignTransferInsufficientFunds from './SignTransferInsufficientFunds';
import SignTransferTransferring from './SignTransferTransferring';
import SignTransferDetails from './SignTransferDetails';

import { signAndSendTransactions } from '../../actions/account'

class Sign extends Component {
    state = {
        appTitle: 'TODO: App Title',
        transferDetails: false,
    }

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

    handleDetails = (show) => {
        this.setState(() => ({
            transferDetails: show
        }))
    }

    renderSubcomponent = () => {
        switch (this.props.status) {
            case 'needs-confirmation':
                return <SignTransferReady {...this.state} handleAllow={this.handleAllow} handleDeny={this.handleDeny} handleDetails={this.handleDetails} sensitiveActionsCounter={this.props.sensitiveActionsCounter} />
            case 'in-progress':
                return <SignTransferTransferring {...this.state} />
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
        return (
            <SignContainer>
                {this.state.transferDetails
                    ? <SignTransferDetails handleDetails={this.handleDetails} transactions={this.state.transactions} fees={this.props.fees} />
                    : this.renderSubcomponent()}
            </SignContainer>
        )
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

    return {
        account,
        ...sign,
    }
}

export const SignWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Sign))
