import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isValidPhoneNumber } from 'react-phone-number-input'

import { Wallet } from '../../utils/wallet'

import SetRecoveryInfoSection from './SetRecoveryInfoSection'
import SetRecoveryInfoForm from './SetRecoveryInfoForm'
import SetRecoveryInfoContainer from './SetRecoveryInfoContainer'

class SetRecoveryInfo extends Component {
   state = {
      loader: false,
      formLoader: false,
      phoneNumber: '',
      isLegit: false,
      sentSms: false,
      successMessage: false,
      errorMessage: false
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

      this.setState(() => ({
         successMessage: false,
         errorMessage: false,
         isLegit: false,
         formLoader: true
      }))

      ;(async () => {
         try {
            if (this.state.sentSms) {
               await this.wallet.validateCode(this.state.phoneNumber, this.props.accountId, this.state.securityCode)
               this.setState(() => ({
                  successMessage: true
               }))

               let nextUrl = `/login/${this.props.url && this.props.url.next_url || '/'}`;
               console.log('nextUrl', nextUrl);
               setTimeout(() => {
                  this.props.history.push(nextUrl)
               }, 1500)
            } else {
               await this.wallet.requestCode(this.state.phoneNumber, this.props.accountId)
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

const mapStateToProps = ({ account }, { match }) => {
   return { accountId: match.params.accountId, url: account.url }
}

export const SetRecoveryInfoWithRouter = connect(mapStateToProps)(SetRecoveryInfo)
