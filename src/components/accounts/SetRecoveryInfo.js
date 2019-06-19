import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import SetRecoveryInfoForm from './SetRecoveryInfoForm'
import { requestCode, setupAccountRecovery, redirectToApp, clear } from '../../actions/account';

class SetRecoveryInfo extends Component {
   state = {
      loader: false,
      phoneNumber: '',
      isLegit: false,
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clear()
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         isLegit: this.isLegitField(name, value)
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

   handleSubmit = e => {
      e.preventDefault()

      if (!this.state.isLegit) {
         return false
      }

      if (!this.props.sentSms) {
         this.props.requestCode(this.state.phoneNumber, this.props.accountId)
      } else {
         this.props.setupAccountRecovery(this.state.phoneNumber, this.props.accountId, this.state.securityCode)
            .then(({error}) => {
               if (error) return

               this.props.redirectToApp()
            })
      }
   }

   skipRecoverySetup = e => {
      e.preventDefault()
      this.props.redirectToApp()
   }

   render() {
      const { loader } = this.state
      const combinedState = {
         ...this.props,
         ...this.state,
         isLegit: this.state.isLegit && !this.props.formLoader
      }
      return (
         <AccountFormContainer 
            loader={loader} 
            title='Protect your Account'
            text='Enter your phone number to make your account easy for you to recover in the future.'
         >
            <AccountFormSection handleSubmit={this.handleSubmit} requestStatus={this.props.requestStatus}>
               <SetRecoveryInfoForm
                  {...combinedState}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                  skipRecoverySetup={this.skipRecoverySetup}
               />
            </AccountFormSection>
         </AccountFormContainer>
      )
   }
}

const mapDispatchToProps = {
   requestCode,
   setupAccountRecovery,
   redirectToApp,
   clear
}

const mapStateToProps = ({ account }, { match }) => ({
   ...account,
   accountId: match.params.accountId
})

export const SetRecoveryInfoWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetRecoveryInfo)
