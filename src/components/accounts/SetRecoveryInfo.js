import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { Wallet } from '../../utils/wallet'

import SetRecoveryInfoSection from './SetRecoveryInfoSection'
import SetRecoveryInfoForm from './SetRecoveryInfoForm'
import SetRecoveryInfoContainer from './SetRecoveryInfoContainer'
import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

class SetRecoveryInfo extends Component {
   state = {
      loader: false,
      formLoader: false,
      phoneNumber: '',
      accountId: 'vlad.near', // TODO: Send account ID from create form, etc
      isLegit: false,
      sentSms: false,
      successMessage: false,
      errorMessage: false
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
      // this.props.handleRefreshUrl(this.props.location)
      // this.props.handleRefreshAccount(this.wallet)
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
         securityCode: value => value.trim().match(/^\d{6}$/)
      }
      return validators[name](value);
   }

   handleSubmit = e => {
      e.preventDefault()

      if (!this.state.isLegit) {
         return false
      }

      this.setState(() => ({
         successMessage: false,
         errorMessage: false,
         isLegit: false,
         formLoader: true
      }))

      ;(async () => {
         try {
            if (this.state.sentSms) {
               await this.wallet.validateCode(this.state.phoneNumber, this.state.accountId, this.state.securityCode)
               this.setState(() => ({
                  successMessage: true
               }))
               // TODO: Redirect to account dashboard
            } else {
               await this.wallet.requestCode(this.state.phoneNumber, this.state.accountId)
               this.setState(() => ({
                  sentSms: true,
                  successMessage: true
               }))
            }
         } catch(e) {
            console.error('Error registering phone:', e);
            this.setState(() => ({
               errorMessage: true
            }))
         } finally {
            this.setState(() => ({
               formLoader: false
            }))
         }
      })()
   }

   render() {
      const { loader } = this.state

      return (
         <SetRecoveryInfoContainer loader={loader} location={this.props.location}>
            <SetRecoveryInfoSection {...this.state}>
               <SetRecoveryInfoForm
                  {...this.state}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
               />
            </SetRecoveryInfoSection>
         </SetRecoveryInfoContainer>
      )
   }
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   account
})

export const SetRecoveryInfoWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(SetRecoveryInfo)
