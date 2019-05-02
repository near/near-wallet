import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parse } from 'query-string'

import { Wallet } from '../../utils/wallet'

import CreateAccountSection from './CreateAccountSection'
import CreateAccountForm from './CreateAccountForm'
import CreateAccountContainer from './CreateAccountContainer'
import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

class CreateAccount extends Component {
   state = {
      loader: false,
      formLoader: false,
      accountId: '',
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
         isLegit: this.wallet.isLegitAccountId(value)
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
         .createNewAccount(this.state.accountId)
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
            console.error('Error creating account:', e)
         })
         .finally(() => {
            this.setState(() => ({
               formLoader: false
            }))
         })
   }

   handleRecaptcha = value => {
      console.log(value)
   }

   render() {
      const { loader } = this.state

      return (
         <CreateAccountContainer loader={loader} location={this.props.location}>
            <CreateAccountSection {...this.state}>
               <CreateAccountForm
                  {...this.state}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                  handleRecaptcha={this.handleRecaptcha}
               />
            </CreateAccountSection>
         </CreateAccountContainer>
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

export const CreateAccountWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(CreateAccount)
