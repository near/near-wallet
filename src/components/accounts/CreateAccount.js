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
      successMessage: false,
      errorMessage: false
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
      // this.props.handleRefreshUrl(this.props.location)
      // this.props.handleRefreshAccount(this.wallet)
   }

   handleChangeAccountId = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         successMessage: false,
         errorMessage: false,
         formLoader: false
      }))

      if (!this.wallet.isLegitAccountId(value)) {
         return false
      }

      this.setState(() => ({
         formLoader: true
      }))

      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
         this.wallet
            .checkNewAccount(value)
            .then(d => {
               this.setState(() => ({
                  successMessage: true,
                  errorMessage: false
               }))
            })
            .catch(e => {
               this.setState(() => ({
                  successMessage: false,
                  errorMessage: true
               }))
            })
            .finally(() => {
               this.setState(() => ({
                  formLoader: false
               }))
            })
      }, 500)
   }

   handleSubmit = e => {
      e.preventDefault()

      if (!this.wallet.isLegitAccountId(this.state.accountId)) {
         return false
      }

      this.setState(() => ({
         successMessage: false,
         errorMessage: false,
         formLoader: true
      }))

      this.wallet
         .createNewAccount(this.state.accountId)
         .then(d => {
            this.setState(() => ({
               successMessage: true
            }))
            this.props.history.push(`/set-recovery/${this.state.accountId}`)
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
                  handleRecaptcha={this.handleRecaptcha}
                  handleChangeAccountId={this.handleChangeAccountId}
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
