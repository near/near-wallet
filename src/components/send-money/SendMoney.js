import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { refreshAccount, checkAccountAvailable, clear, setFormLoader, sendMoney, clearAlert } from '../../actions/account'
import BN from 'bn.js'
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'
import SendMoneyThirdStep from './SendMoneyThirdStep'
import SendMoneyContainer from './SendMoneyContainer'
import AlertBanner from '../staking/components/AlertBanner'

class SendMoney extends Component {
    state = {
        loader: false,
        step: 1,
        note: '',
        expandNote: false,
        accountId: '',
        amount: '',
        amountStatus: '',
        implicitAccount: false,
        implicitAccountModal: false,
        useMax: false
    }

    async componentDidMount() {
        const accountId = this.props.match.params.id
        if (!accountId) return;

        // TODO: Why not use global loader?
        this.setState(() => ({
            loader: true
        }))
        try {
            // TODO: Does this show error through middleware?
            await this.props.checkAccountAvailable(accountId);
        } finally {
            this.setState(() => ({ accountId, loader: false }))
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.step !== this.state.step && prevState.step < this.state.step) {
            window.scrollTo(0, 0);
        }

        if (prevProps.location.key !== this.props.location.key && this.state.step !== 1) {
            this.props.clear()

            this.setState(() => ({
                step: 1,
                note: '',
                amount: '',
                accountId: '',
                successMessage: false
            }))
        }
    }

    componentWillUnmount = () => {
        this.props.clear()
    }

    handleGoBack = () => {
        this.setState(() => ({
            step: 1
        }))
    }

    handleCloseModal = () => {
        this.setState(() => ({
            implicitAccountModal: false
        }))
    }

    handleCancelTransfer = () => {
        this.props.clear()
        this.props.history.push('/')
    }

    handleNextStep = async (e) => {
        e.preventDefault()
        const { step, accountId, amount, implicitAccount, implicitAccountModal } = this.state

        if (step === 2) {
            this.setState({ loader: true })

            try {
                await this.props.sendMoney(accountId, parseNearAmount(amount))
                await this.props.refreshAccount()
                this.setState({ step: step + 1 })
                await this.props.clearAlert()
            } catch(e) {
                console.error(e)
            } finally {
                this.setState({ loader: false })
                return
            }
        }

        if (implicitAccount && !implicitAccountModal) {
            this.setState({ implicitAccountModal: true })
        } else {
            this.setState({
                step: step + 1,
                amount: amount,
                implicitAccountModal: false
            })
        }

    }

    handleChange = (e, { name, value }) => {
        this.setState((state) => ({
            [name]: value,
            implicitAccount: name === 'accountId' 
                ? this.isImplicitAccount(value)
                : state.implicitAccount
        }))
    }

    handleChangeAmount = (e) => {
        const value = e.target.value
        this.setState({ amountStatus: '', useMax: false })

        if (!/^\d*[.]?\d*$/.test(value)) {
            return
        }

        if (new BN(this.props.balance.available).sub(new BN(parseNearAmount(WALLET_APP_MIN_AMOUNT))).lt(new BN(parseNearAmount(value)))) {
            this.setState({ amountStatus: 'insufficient' })
        }

        this.setState({ amount: value })
    }

    handleUseMax = () => {
        this.setState({ 
            amountStatus: 'useMax', 
            useMax: true, 
            amount: formatNearAmount(new BN(this.props.balance.available).sub(new BN(parseNearAmount(WALLET_APP_MIN_AMOUNT))).toString(), 5)
        })
    }

    handleRedirectDashboard = () => {
        this.props.history.push(`/`)
    }

    handleExpandNote = () => {
        this.setState(() => ({
            expandNote: true
        }))
    }

    isLegitForm = () => {
        const { amount, amountStatus, implicitAccount } = this.state
        const { requestStatus } = this.props
        
        return ((requestStatus && requestStatus.success) || implicitAccount) && amount > 0 && amountStatus !== 'insufficient'
            ? true
            : false
    }

    isImplicitAccount = (accountId) => accountId.length === 64

    render() {
        const { step, implicitAccountModal, implicitAccount, amountStatus } = this.state
        const { formLoader, requestStatus, checkAccountAvailable, setFormLoader, clear, accountId } = this.props

        return (
            <SendMoneyContainer>
                {step === 1 && amountStatus &&
                    <AlertBanner
                        title={`sendMoney.banner.${amountStatus}`}
                        titleData={WALLET_APP_MIN_AMOUNT}
                        theme={amountStatus === 'insufficient' ? 'error' : ''}
                    />
                }
                {step === 1 && (
                    <SendMoneyFirstStep
                        handleNextStep={this.handleNextStep}
                        handleChange={this.handleChange}
                        isLegitForm={this.isLegitForm}
                        formLoader={formLoader}
                        requestStatus={requestStatus}
                        checkAvailability={checkAccountAvailable}
                        clearRequestStatus={clear}
                        setFormLoader={setFormLoader}
                        stateAccountId={accountId}
                        defaultAccountId={this.props.match.params.id || this.state.accountId}
                        implicitAccountModal={implicitAccountModal}
                        handleCloseModal={this.handleCloseModal}
                        implicitAccount={implicitAccount}
                        handleUseMax={this.handleUseMax}
                        handleChangeAmount={this.handleChangeAmount}
                        {...this.state}
                    />
                )}
                {step === 2 && (
                    <SendMoneySecondStep
                        handleNextStep={this.handleNextStep}
                        handleExpandNote={this.handleExpandNote}
                        handleGoBack={this.handleGoBack}
                        handleCancelTransfer={this.handleCancelTransfer}
                        {...this.state}
                    />
                )}
                {step === 3 && (
                    <SendMoneyThirdStep
                        handleRedirectDashboard={this.handleRedirectDashboard}
                        {...this.state}
                    />
                )}
            </SendMoneyContainer>
        )
    }
}

const mapDispatchToProps = {
    refreshAccount,
    checkAccountAvailable,
    clear,
    setFormLoader,
    sendMoney,
    clearAlert
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SendMoneyWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SendMoney))
