import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { requestCode, recoverAccount, redirectToApp, checkAccountAvailable, clear, clearCode } from '../../actions/account'

import RecoverAccountForm from './RecoverAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'

class RecoverAccount extends Component {
   state = {
      loader: false,
      accountId: '',
      phoneNumber: '',
      isLegit: false,
      resendLoader: false
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clear()
      this.props.clearCode()
   }

   handleChange = (e, { name, value }) => {
      this.setState((state) => ({
         [name]: value,
         isLegit: name === 'accountId' ? state.isLegit : this.isLegitField(name, value)
      }))
   }

   isLegitField(name, value) {
      // TODO: Use some validation framework?
      let validators = {
         phoneNumber: isValidPhoneNumber,
         securityCode: value => !!value.trim().match(/^\d{6}$/)
      }
      return validators[name](value);
   }

   handleStartOver = e => {
      e.preventDefault()

      this.props.clearCode()
      this.props.clear()

      this.setState(() => ({
         accountId: '',
         phoneNumber: ''
      }))
   }

   handleResendCode = e => {
      e.preventDefault()

      this.setState(() => ({
         resendLoader: true
      }))
      
      this.props.requestCode(this.state.phoneNumber, this.state.accountId)
         .finally(() => {
            this.setState(() => ({
               resendLoader: false
            }))
         })
   }

   handleSubmit = e => {
      e.preventDefault()

      if (!this.state.isLegit) {
         return false
      }

      this.setState(() => ({
         loader: true
      }))

      const accountId = this.state.accountId // || this.props.accountId;
      if (!this.props.sentSms) {
         this.props.requestCode(this.state.phoneNumber, accountId)
            .finally(() => {
               this.setState(() => ({
                  loader: false,
                  isLegit: false
               }))
               this.props.clear()
            })
      } else {
         this.props.recoverAccount(this.state.phoneNumber, accountId, this.state.securityCode)
            .then(({ error }) => {
               if (error) return
               this.props.redirectToApp()
            })
            .finally(() => {
               this.setState(() => ({
                  loader: false,
                  isLegit: false
               }))
            })
      }
   }

   render() {
      const combinedState = {
         ...this.props,
         ...this.state,
         isLegit: this.state.isLegit && !this.props.formLoader
      }
      const { sentSms } = this.props

      return (
         <AccountFormContainer 
            wide={sentSms ? true : false}
            title={sentSms ? `Enter your Code` : `Find your Account`}
            text={sentSms ? (
               <Fragment>
                  Your 6-digit code has been sent to: <span>{this.state.phoneNumber}</span>
                  <br/>
                  Enter it below to recover the account: <span>@{this.state.accountId}</span>
               </Fragment>
            ) : `Enter your information associated with the account and we will send a recovery code.`}
         >
            <AccountFormSection requestStatus={this.props.requestStatus} handleSubmit={this.handleSubmit.bind(this)}>
               <RecoverAccountForm
                  {...combinedState}
                  handleChange={this.handleChange}
                  handleStartOver={this.handleStartOver}
                  handleResendCode={this.handleResendCode}
               />
            </AccountFormSection>
         </AccountFormContainer>
      )
   }
}

const mapDispatchToProps = {
   requestCode, 
   recoverAccount, 
   redirectToApp,
   checkAccountAvailable,
   clear,
   clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account
})

export const RecoverAccountWithRouter = connect(
   mapStateToProps, 
   mapDispatchToProps
)(RecoverAccount)
