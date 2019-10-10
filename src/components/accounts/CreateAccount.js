import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateAccountForm from './CreateAccountForm'
import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import { checkNewAccount, createNewAccount, clear, refreshAccount, resetAccounts } from '../../actions/account'

class CreateAccount extends Component {
   state = {
      loader: false,
      accountId: ''
   }

   componentDidMount = () => {
      const { loginError, loginErrorMessage } = this.props

      if (loginError) {
         console.error('Error loading account:', loginErrorMessage)

         if (loginErrorMessage.indexOf('does not exist while viewing') !== -1) {
            // We have an account in the storage, but it doesn't exist on blockchain. We probably nuked storage so just redirect to create account
            // TODO: Offer to remove specific account vs clearing everything?

            this.props.resetAccounts()
         }
      }
   }

   componentWillUnmount = () => {
      this.props.clear()
   }

   handleChange = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value
      }))
   }

   handleSubmit = e => {
      e.preventDefault()

      this.setState(() => ({
         loader: true
      }))

      const { accountId } = this.state

      this.props.createNewAccount(accountId).then(({ error }) => {
         if (error) return

         this.props.refreshAccount(true)

         let nextUrl = `/set-recovery/${accountId}`
         this.props.history.push(nextUrl)
      })
      .finally(() => {
         this.setState(() => ({
            loader: false
         }))
      })
   }

   handleRecaptcha = value => {
      console.log(value)
   }

   render() {
      const { loader } = this.state
      const { requestStatus, formLoader } = this.props

      return (
         <AccountFormContainer 
            location={this.props.location}
            title='Create Account'
            text='Creating a NEAR account is easy. Just choose a username and you’re ready to go.'
            loginResetAccounts={this.props.loginResetAccounts}
         >
            <AccountFormSection 
               requestStatus={this.props.requestStatus}
               handleSubmit={this.handleSubmit}
               location={this.props.location}
            >
               <CreateAccountForm
                  loader={loader} 
                  requestStatus={requestStatus}
                  formLoader={formLoader}
                  handleRecaptcha={this.handleRecaptcha}
                  handleChange={this.handleChange}
               />
            </AccountFormSection>
         </AccountFormContainer>
      )
   }
}

const mapDispatchToProps = {
   checkNewAccount,
   createNewAccount,
   clear,
   refreshAccount,
   resetAccounts
}

const mapStateToProps = ({ account }) => ({
   ...account
})

export const CreateAccountWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(CreateAccount)
