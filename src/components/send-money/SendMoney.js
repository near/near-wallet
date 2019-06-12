import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

import SendMoneyContainer from './SendMoneyContainer'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'
import SendMoneyThirdStep from './SendMoneyThirdStep'

class SendMoney extends Component {
   state = {
      loader: false,
      formLoader: false,
      step: 1,
      note: '',
      expandNote: false,
      paramAccountId: false,
      accountId: '',
      successMessage: false,
      errorMessage: false,
      amount: '',
      amountStatus: ''
   }

   componentDidMount() {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)

      const paramId = this.props.match.params.id

      this.setState(() => ({
         loader: true
      }))

      if (paramId) {
         this.wallet
            .checkAccount(paramId)
            .then(d => {
               this.setState(() => ({
                  paramAccountId: true,
                  accountId: paramId
               }))
            })
            .catch(e => {
               this.setState(() => ({
                  accountId: ''
               }))
            })
            .finally(() => {
               this.setState(() => ({
                  loader: false
               }))
            })
      } else {
         this.setState(() => ({
            loader: false
         }))
      }
   }

   handleGoBack = () => {
      this.setState(() => ({
         step: 1
      }))
   }

   handleCancelTransfer = () => {
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

   handleNextStep = () => {
      const { step, accountId, amount} = this.state;

      if (step === 2) {
         this.setState(() => ({
            loader: true
         }))

         this.wallet.sendTokens(this.wallet.getAccountId(), accountId, amount)
            .then(() => {
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
         step: state.step + 1
      }))
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         amountStatus: !Number.isInteger(Number(value))
            ? 'Please enter a whole number.'
            : value > this.props.amount 
               ? 'Not enough tokens.' 
               : ''
      }))

      this.setState(() => ({
         [name]: value
      }))
   }

   handleExpandNote = () => {
      this.setState(() => ({
         expandNote: true
      }))
   }

   handleChangeAccountId = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         successMessage: false,
         errorMessage: false,
         formLoader: false
      }))

      if (!this.wallet.isLegitAccountId(value)) {
         return false
      }

      this.setState(() => ({
         formLoader: true
      }))

      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
         this.wallet
            .checkAccount(value)
            .then(d => {
               this.setState(() => ({
                  successMessage: true,
                  errorMessage: false
               }))
            })
            .catch(e => {
               this.setState(() => ({
                  successMessage: false,
                  errorMessage: true
               }))
            })
            .finally(() => {
               this.setState(() => ({
                  formLoader: false
               }))
            })
      }, 500)
   }

   render() {
      const { step } = this.state

      return (
         <SendMoneyContainer step={step} handleCancelTransfer={this.handleCancelTransfer}>
            {step === 1 && (
               <SendMoneyFirstStep
                  handleNextStep={this.handleNextStep}
                  handleChange={this.handleChange}
                  handleChangeAccountId={this.handleChangeAccountId}
                  {...this.state}
               />
            )}
            {step === 2 && (
               <SendMoneySecondStep
                  handleNextStep={this.handleNextStep}
                  handleExpandNote={this.handleExpandNote}
                  handleGoBack={this.handleGoBack}
                  {...this.state}
               />
            )}
            {step === 3 && <SendMoneyThirdStep {...this.state} />}
         </SendMoneyContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   ...account
})

export const SendMoneyWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(SendMoney))
