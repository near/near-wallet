import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateAccountForm from './CreateAccountForm'
import CreateAccountContainer from './CreateAccountContainer'
import { checkNewAccount, createNewAccount, clear } from '../../actions/account'

class CreateAccount extends Component {
   state = {
      loader: false,
      accountId: ''
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clear()
   }

   handleChangeAccountId = (e, { name, value }) => {
      this.setState(() => ({
         [name]: value
      }))

      this.timeout && clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
         this.props.checkNewAccount(value)
      }, 500)
   }

   handleSubmit = e => {
      e.preventDefault()

      const { accountId } = this.state

      this.props.createNewAccount(accountId).then(({ error }) => {
         if (error) return

         let nextUrl = `/set-recovery/${accountId}`
         setTimeout(() => {
            this.props.history.push(nextUrl)
         }, 200)
      })
   }

   handleRecaptcha = value => {
      console.log(value)
   }

   render() {
      const { loader, accountId } = this.state
      const { requestStatus, formLoader } = this.props

      return (
         <CreateAccountContainer loader={loader} location={this.props.location}>
            <CreateAccountForm
               accountId={accountId}
               requestStatus={requestStatus}
               formLoader={formLoader}
               handleSubmit={this.handleSubmit}
               handleRecaptcha={this.handleRecaptcha}
               handleChangeAccountId={this.handleChangeAccountId}
            />
         </CreateAccountContainer>
      )
   }
}

const mapDispatchToProps = {
   checkNewAccount,
   createNewAccount,
   clear
}

const mapStateToProps = ({ account }) => ({
   ...account
})

export const CreateAccountWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(CreateAccount)
