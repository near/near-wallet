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
      form_loader: false,
      account_id: '',
      is_legit: false,
      success_message: false,
      error_message: false
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
      // this.props.handleRefreshUrl(this.props.location)
      // this.props.handleRefreshAccount(this.wallet)
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value,
         is_legit: this.wallet.is_legit_account_id(value)
      }))
   }

   handleSubmit = e => {
      e.preventDefault()

      if (!this.state.is_legit) {
         return false
      }

      this.setState(() => ({
         success_message: false,
         error_message: false,
         is_legit: false,
         form_loader: true
      }))

      this.wallet
         .create_new_account(this.state.account_id)
         .then(d => {
            this.setState(() => ({
               success_message: true
            }))
            setTimeout(() => {
               this.props.history.push(
                  `/login/${parse(this.props.location.search).next_url || '/'}`
               )
            }, 1500)
         })
         .catch(e => {
            this.setState(() => ({
               error_message: true
            }))
            console.log(e)
         })
         .finally(() => {
            this.setState(() => ({
               form_loader: false
            }))
         })
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
