import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { Wallet } from '../../utils/wallet'

import AccountFormSection from './AccountFormSection'
import RecoverAccountForm from './RecoverAccountForm'
import RecoverAccountContainer from './RecoverAccountContainer'
import { requestCode, recoverAccount } from '../../actions/account';

class RecoverAccount extends Component {
   state = {
      loader: false,
      phoneNumber: '',
      isLegit: false,
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
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
         accountId: value => this.wallet.isLegitAccountId(value),
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

      const { dispatch } = this.props;
      const accountId = this.state.accountId || this.props.accountId;
      if (!this.props.sentSms) {
         dispatch(requestCode(this.state.phoneNumber, accountId))
      } else {
         dispatch(recoverAccount(this.state.phoneNumber, accountId, this.state.securityCode))
      }
   }

   render() {
      const { loader } = this.state
      const combinedState = {
         ...this.props,
         ...this.state,
         isLegit: this.state.isLegit && !this.props.formLoader
      }
      return (
         <RecoverAccountContainer loader={loader} location={this.props.location}>
            <AccountFormSection {...combinedState}>
               <RecoverAccountForm
                  {...combinedState}
                  handleSubmit={this.handleSubmit.bind(this)}
                  handleChange={this.handleChange}
               />
            </AccountFormSection>
         </RecoverAccountContainer>
      )
   }
}

const mapStateToProps = ({ account }, { match }) => {
   return {
      ...account,
      accountId: match.params.accountId
   }
}

export const RecoverAccountWithRouter = connect(mapStateToProps)(RecoverAccount)
