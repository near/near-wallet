import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import { refreshAccount, switchAccount, addAccessKey, clearAlert } from '../../actions/account'

class Login extends Component {
   state = {
      buttonLoader: false,
      dropdown: false
   }

   componentDidMount = () => {}

   componentWillUnmount = () => {
      this.props.clearAlert()
   }

   handleOnClick = () => {
      this.setState({
         dropdown: !this.state.dropdown
      })
   }

   handleDeny = e => {
      e.preventDefault();
      if (this.props.account.url.failure_url) {
         window.location.href = this.props.account.url.failure_url
      }
   }

   handleAllow = () => {
      this.setState(() => ({
         buttonLoader: true
      }))

      const { account } = this.props
      const { url } = account
      this.props.addAccessKey(account.accountId, url.contract_id, url.public_key, url.success_url, url.title)
         .then(({ error }) => {
            if (error) return

            const { success_url, public_key } = url
            if (success_url) {
               const parsedUrl = new URL(success_url)
               parsedUrl.searchParams.set('account_id', account.accountId)
               parsedUrl.searchParams.set('public_key', public_key)
               window.location = parsedUrl.href
            } else {
               let nextUrl = `/authorized-apps`
               setTimeout(() => {
                  this.props.history.push(nextUrl)
               }, 1500)
            }
         })
         .finally(() => {
            this.setState(() => ({
               buttonLoader: false
            }))
         })
   }

   handleSelectAccount = accountId => {
      this.props.switchAccount(accountId)
      this.props.refreshAccount(true)
   }

   redirectCreateAccount = () => {
      this.props.history.push('/create')
   }

   render() {
      const { account } = this.props
      return (
         <LoginContainer>
            {account.accountId && (
               <LoginForm
                  {...this.state}
                  appTitle={account.url && account.url.title}
                  contractId={account.url && account.url.contract_id}
                  handleOnClick={this.handleOnClick}
                  handleDeny={this.handleDeny}
                  handleAllow={this.handleAllow}
                  handleSelectAccount={this.handleSelectAccount}
                  redirectCreateAccount={this.redirectCreateAccount}
               />
            )}
         </LoginContainer>
      )
   }
}

const mapDispatchToProps = {
   refreshAccount,
   switchAccount,
   addAccessKey,
   clearAlert
}

const mapStateToProps = ({ account }) => ({
   account
})

export const LoginWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Login))
