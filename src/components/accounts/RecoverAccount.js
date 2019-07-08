import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { requestCode, recoverAccount, redirectToApp, checkAccountAvailable, clear } from '../../actions/account'

import RecoverAccountForm from './RecoverAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'

class RecoverAccount extends Component {
   state = {
      loader: false,
      accountId: '',
      phoneNumber: '',
      isLegit: false,
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clear()
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

   isLegitForm = () => this.props.requestStatus && this.props.requestStatus.success && this.state.isLegit

   handleSubmit = e => {
      e.preventDefault()

      if (!this.isLegitForm()) {
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
                  loader: false
               }))
            })
      } else {
         this.props.recoverAccount(this.state.phoneNumber, accountId, this.state.securityCode)
            .then(({ error }) => {
               if (error) return;
               this.props.redirectToApp()
            })
            .finally(() => {
               this.setState(() => ({
                  loader: false
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

      return (
         <AccountFormContainer 
            title='Find your Account'
            text='Enter your information associated with the account and we will send a recovery code.'
         >
            <AccountFormSection requestStatus={this.props.requestStatus} handleSubmit={this.handleSubmit.bind(this)}>
               <RecoverAccountForm
                  {...combinedState}
                  handleChange={this.handleChange}
                  isLegitForm={this.isLegitForm}
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
   clear
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
})

export const RecoverAccountWithRouter = connect(
   mapStateToProps, 
   mapDispatchToProps
)(RecoverAccount)
