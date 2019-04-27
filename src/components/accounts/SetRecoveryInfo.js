import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parse } from 'query-string'
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
      isLegit: false,
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
         isLegit: isValidPhoneNumber(value)
      }))
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

      this.wallet
         .registerPhone(this.state.phoneNumber)
         .then(d => {
            this.setState(() => ({
               successMessage: true
            }))
            setTimeout(() => {
               this.props.history.push(
                  `/login/${parse(this.props.location.search).next_url || '/'}`
               )
            }, 1500)
         })
         .catch(e => {
            this.setState(() => ({
               errorMessage: true
            }))
            console.error('Error creating account:', e);
         })
         .finally(() => {
            this.setState(() => ({
               formLoader: false
            }))
         })
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
