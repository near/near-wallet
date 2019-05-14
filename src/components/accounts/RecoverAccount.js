import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { Wallet } from '../../utils/wallet'

import RecoverAccountSection from './RecoverAccountSection'
import RecoverAccountForm from './RecoverAccountForm'
import RecoverAccountContainer from './RecoverAccountContainer'
import { requestCode, validateCode } from '../../actions/account';

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
      if (!this.props.sentSms) {
         dispatch(requestCode(this.state.phoneNumber, this.props.accountId))
      } else {
         dispatch(validateCode(this.state.phoneNumber, this.props.accountId, this.state.securityCode))
            .then(() => {
               let nextUrl = `/login/${(this.props.url && this.props.url.next_url) || '/'}`;
               setTimeout(() => {
                  this.props.history.push(nextUrl)
               }, 1500)
            })
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
            <RecoverAccountSection {...combinedState}>
               <RecoverAccountForm
                  {...combinedState}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
               />
            </RecoverAccountSection>
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
