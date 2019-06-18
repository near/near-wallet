import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import { handleRefreshAccount, handleRefreshUrl, checkAccountAvailable, clear } from '../../actions/account'

import SendMoneyContainer from './SendMoneyContainer'
import SendMoneyFirstStep from './SendMoneyFirstStep'
import SendMoneySecondStep from './SendMoneySecondStep'
import SendMoneyThirdStep from './SendMoneyThirdStep'

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
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)

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

   handleNextStep = () => {
      const { step, accountId, amount} = this.state;

      if (step === 2) {
         this.setState(() => ({
            loader: true
         }))

         this.wallet.sendTokens(this.wallet.getAccountId(), accountId, amount)
            .then(() => {
               this.props.handleRefreshAccount(this.wallet, this.props.history)

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
         [name]: value
      }))

      if (!this.wallet.isLegitAccountId(value)) {
         return false
      }

      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
         this.props.checkAccountAvailable(value)
      }, 500)
   }

   render() {
      const { step } = this.state
      const { requestStatus, formLoader } = this.props

      return (
         <SendMoneyContainer step={step} handleCancelTransfer={this.handleCancelTransfer}>
            {step === 1 && (
               <SendMoneyFirstStep
                  handleNextStep={this.handleNextStep}
                  handleChange={this.handleChange}
                  handleChangeAccountId={this.handleChangeAccountId}
                  requestStatus={requestStatus}
                  formLoader={formLoader}
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
   handleRefreshUrl,
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
