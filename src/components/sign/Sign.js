import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import BN from 'bn.js'
import { Translate } from 'react-localize-redux'
import SignContainer from './SignContainer'
import SignTransferReady from './SignTransferReady'
import SignTransferSuccess from './SignTransferSuccess'
import SignTransferCancelled from './SignTransferCancelled'
import SignTransferTransferring from './SignTransferTransferring'
import { signAndSendTransactions, getBalance, handleRefreshUrl } from '../../actions/account'
import { Mixpanel } from '../../mixpanel'
import { base_encode } from 'near-api-js/lib/utils/serialize'

class Sign extends Component {

    state = {
        sending: false,
    }

    componentDidMount = () => {
        const { dispatch } = this.props
        dispatch(handleRefreshUrl())
        dispatch(getBalance())
    }

    handleDeny = e => {
        e.preventDefault();
        Mixpanel.track("SIGN Deny the transaction")
        const { callbackUrl, meta } = this.props;
        // TODO: Dispatch action for app redirect?
        if (this.props.callbackUrl) {
            window.location.href = addQueryParams(callbackUrl, { meta, errorCode: 'userRejected' })
        }
    }

    handleAllow = async () => {
        this.setState({ sending: true })
        await Mixpanel.withTracking("SIGN",
            async () => {
                // TODO: Maybe this needs Redux reducer to propagate result into state?
                const { transactions, account: { accountId }, callbackUrl, meta, dispatch } = this.props;

                const transactionHashes = await dispatch(signAndSendTransactions(transactions, accountId))
                console.log('transactionHashes', transactionHashes);
                if (this.props.callbackUrl) {
                    window.location.href = addQueryParams(callbackUrl, {
                        meta,
                        transactionHashes: transactionHashes.map(hash => base_encode(hash)).join(',')
                    })
                }
            }
        )
    }

    renderSubcomponent = () => {
        const { account: { url, balance }, totalAmount, sensitiveActionsCounter, status } = this.props

        const txTotalAmount = new BN(totalAmount) // TODO: add gas cost, etc
        const availableBalance = balance.available
        const insufficientFunds = availableBalance
            ? txTotalAmount.gt(new BN(availableBalance))
            : false
        const isMonetaryTransaction = txTotalAmount.gt(new BN(0))

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

function addQueryParams(baseUrl, queryParams) {
    const url = new URL(baseUrl);
    for (let key in queryParams) {
        url.searchParams.set(key, queryParams[key]);
    }
    return url.toString();
}

const mapStateToProps = ({ account, sign }) => ({
    account,
    ...sign
})

export const SignWithRouter = connect(
    mapStateToProps
)(withRouter(Sign))
