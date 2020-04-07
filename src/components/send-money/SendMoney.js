import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { wallet } from '../../utils/wallet'

import { refreshAccount, checkAccountAvailable, clear } from '../../actions/account'

import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'
import SendMoneyThirdStep from './SendMoneyThirdStep'
import SendMoneyContainer from './SendMoneyContainer'

class SendMoney extends Component {
    state = {
        loader: false,
        step: 1,
        note: '',
        expandNote: false,
        paramAccountId: false,
        accountId: '',
        amount: '',
        amountStatus: ''
    }

    componentDidMount() {
        const paramId = this.props.match.params.id

        this.setState(() => ({
            loader: true
        }))

        if (paramId) {
            this.props.checkAccountAvailable(paramId).then(({ error }) => {
                this.setState(() => ({
                    loader: false,
                    accountId: paramId
                }))

                if (error) return

                this.setState(() => ({
                    paramAccountId: true
                }))
            })
        } else {
            this.setState(() => ({
                loader: false
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

    handleCancelTransfer = () => {
        this.props.clear()

        this.setState(() => ({
            step: 1,
            note: '',
            amount: '',
            accountId: '',
            successMessage: false,
            paramAccountId: false,
        }))

        this.props.history.push('/send-money')
    }

    handleNextStep = (e) => {
        e.preventDefault()
        const { step, accountId, amount} = this.state;

        if (step === 2) {
            this.setState(() => ({
                loader: true
            }))

            wallet.sendMoney(accountId, amount)
                .then(() => {
                    this.props.refreshAccount()

                    this.setState(state => ({
                        step: state.step + 1
                    }))
                })
                .catch(console.error)
                .finally(() => {
                    this.setState(() => ({
                        loader: false
                    }))
                })
            return;
        }

        this.setState(state => ({
            step: state.step + 1,
            amount: state.amount
        }))
    }

    handleChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value
        }))
    }

    get requestStatusSameAccount() {
        if (this.props.accountId !== this.state.accountId) {
            return null
        }
        return {
            success: false,
            messageCode: 'account.available.errorSameAccount',
        }
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
        const { paramAccountId, amount, amountStatus } = this.state
        const { requestStatus } = this.props
        return paramAccountId
            ? ((amount) > 0 && amountStatus === '')
            : (requestStatus && requestStatus.success && (amount) > 0 && amountStatus === '')
    }

    render() {
        const { step } = this.state
        const { formLoader, requestStatus, checkAccountAvailable } = this.props

        return (
            <SendMoneyContainer>
                {step === 1 && (
                    <SendMoneyFirstStep
                        handleNextStep={this.handleNextStep}
                        handleChange={this.handleChange}
                        isLegitForm={this.isLegitForm}
                        formLoader={formLoader}
                        requestStatus={this.requestStatusSameAccount || requestStatus}
                        checkAvailability={checkAccountAvailable}
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
    clear
}

const mapStateToProps = ({ account }) => ({
    ...account
})

export const SendMoneyWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SendMoney))
