import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import { handleRefreshAccount, handleRefreshUrl, switchAccount, addAccessKey, clearAlert } from '../../actions/account'

class Login extends Component {
   state = {
      buttonLoader: false,
      dropdown: false
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.props.history)
   }

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

      this.props.addAccessKey(this.props.account.accountId, this.props.account.url.contract_id, this.props.account.url.public_key, this.props.account.url.success_url, this.props.account.url.title)
         .then(({ error }) => {
            if (error) return

            if (this.props.account.url.redirect_url) {
               window.location = this.props.account.url.redirect_url
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
      this.props.handleRefreshAccount(this.props.history)
   }

   redirectCreateAccount = () => {
      this.wallet.redirectToCreateAccount({}, this.props.history)
   }

   render() {
      const { account } = this.props

      return (
         <LoginContainer
            loader={account.loader}
            appTitle={account.url && account.url.title}
         >
            {account.accountId && (
               <LoginForm
                  {...this.state}
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
   handleRefreshAccount,
   handleRefreshUrl,
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
