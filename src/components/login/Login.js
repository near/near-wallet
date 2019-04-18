import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'

import { Wallet } from '../../utils/wallet'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import { handleRefreshAccount, handleRefreshUrl } from '../../actions/account'

class Login extends Component {
   state = {
      dropdown: false
   }

   componentDidMount = () => {
      this.wallet = new Wallet()
      this.props.handleRefreshUrl(this.props.location)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
   }

   handleOnClick = () => {
      this.setState({
         dropdown: !this.state.dropdown
      })
   }

   handleDeny = e => {
      e.preventDefault()
      if (this.props.account.url.failure_url) {
         window.location.href = this.props.account.url.failure_url
      }
   }

   handleSelectAccount = account_id => {
      this.wallet.select_account(account_id)
      this.props.handleRefreshAccount(this.wallet, this.props.history)
   }

   redirectCreateAccount = () => {
      this.wallet.redirect_to_create_account({}, this.props.history)
   }

   accountIdShort = account_id =>
      account_id.length > 12
         ? account_id.substring(0, 12).concat('...')
         : account_id

   render() {
      const { account } = this.props

      return (
         <LoginContainer
            loader={account.loader}
            app_title={account.url && account.url.app_title}
         >
            {account.account_id && (
               <LoginForm
                  {...this.state}
                  handleOnClick={this.handleOnClick}
                  accountIdShort={this.accountIdShort}
                  handleDeny={this.handleDeny}
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
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   account
})

export const LoginWithRouter = connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(Login))
