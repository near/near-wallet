import BN from 'bn.js';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Mixpanel } from '../../mixpanel';
import { redirectTo } from '../../redux/actions/account';
import { selectAccountSlice } from '../../redux/slices/account';
import { addQueryParams, handleSignTransactions, selectSignFeesGasLimitIncludingGasChanges, selectSignSlice, SIGN_STATUS } from '../../redux/slices/sign';
import { selectStatusActionStatus } from '../../redux/slices/status';
import SignContainer from './SignContainer';
import SignTransferCancelled from './SignTransferCancelled';
import SignTransferReady from './SignTransferReady';
import SignTransferRetry from './SignTransferRetry';
import SignTransferSuccess from './SignTransferSuccess';
import SignTransferTransferring from './SignTransferTransferring';

class Sign extends Component {

    state = {
        sending: false,
    }

    handleDeny = e => {
        e.preventDefault();
        Mixpanel.track("SIGN Deny the transaction");
        const { callbackUrl, meta, signTxStatus } = this.props;
        // TODO: Dispatch action for app redirect?
        if (this.props.callbackUrl) {

            if (signTxStatus?.success !== false) {
                window.location.href = addQueryParams(callbackUrl, {
                    meta,
                    errorCode: encodeURIComponent('userRejected'),
                    errorMessage: encodeURIComponent('User rejected transaction')
                });
                return;
            }

            window.location.href = addQueryParams(callbackUrl, {
                meta,
                errorCode: encodeURIComponent(signTxStatus?.errorType) || encodeURIComponent('unknownError'),
                errorMessage: encodeURIComponent(signTxStatus?.errorMessage?.substring(0, 100)) || encodeURIComponent('Unknown error')
            });
            return;
        }
    }

    handleAllow = async () => {
        // TODO: to be removed after refactoring sign reducer into redux toolkit version with status object
        this.setState({ sending: true });

        await this.props.dispatch(handleSignTransactions());
        this.redirectToApp();
    }

    redirectToApp = () => {
        const { callbackUrl, meta, transactionHashes = [] } = this.props;
        if (callbackUrl && !!transactionHashes.length) {
            window.location.href = addQueryParams(callbackUrl, {
                meta,
                transactionHashes: transactionHashes.join(',')
            });
        }
    }

    renderSubcomponent = () => {
        const { account: { url, balance }, totalAmount, sensitiveActionsCounter, status, dispatch, gasLimit } = this.props;

        const txTotalAmount = new BN(totalAmount); // TODO: add gas cost, etc
        const availableBalance = balance?.available;
        const insufficientFunds = availableBalance
            ? txTotalAmount.gt(new BN(availableBalance))
            : false;
        const isMonetaryTransaction = txTotalAmount.gt(new BN(0));

        switch (status) {
            case SIGN_STATUS.NEEDS_CONFIRMATION:
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
                        />;
            case SIGN_STATUS.IN_PROGRESS:
                return <SignTransferTransferring
                            {...this.state}
                            isMonetaryTransaction={isMonetaryTransaction}
                        />;
            case SIGN_STATUS.SUCCESS:
                return <SignTransferSuccess
                            handleClose={() => dispatch(redirectTo('/'))}
                            isMonetaryTransaction={isMonetaryTransaction}
                            txTotalAmount={txTotalAmount}
                        />;
            case SIGN_STATUS.RETRY_TRANSACTION:
                return <SignTransferRetry
                            handleRetry={this.handleAllow}
                            handleDeny={this.handleDeny}
                            gasLimit={new BN(gasLimit).div(new BN('1000000000000')).toString()}
                        />;
            case SIGN_STATUS.ERROR:
                // TODO: Figure out how to handle different error types
                return <SignTransferCancelled handleDeny={this.handleDeny} />;
            default:
                return <b><Translate id='sign.unexpectedStatus' />: {status}</b>;
        }
    }

    render() {
        return <SignContainer>{this.renderSubcomponent()}</SignContainer>;
    }
}

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    ...selectSignSlice(state),
    signTxStatus: selectStatusActionStatus(state).SIGN_AND_SEND_TRANSACTIONS,
    gasLimit: selectSignFeesGasLimitIncludingGasChanges(state)
});

export const SignWithRouter = connect(
    mapStateToProps
)(withRouter(Sign));
