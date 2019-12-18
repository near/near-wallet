import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import LoginConfirm from './LoginConfirm'
import LoginDetails from './LoginDetails'

import { handleRefreshAccount, handleRefreshUrl, switchAccount, addAccessKey, clearAlert } from '../../actions/account'

class Login extends Component {
   state = {
      buttonLoader: false,
      dropdown: false,
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
      this.props.handleRefreshAccount(this.props.history)
   }

   redirectCreateAccount = () => {
      this.props.history.push('/create')
   }

   render() {
      const { account, match } = this.props

      return (
         <LoginContainer>
            <Route
               exact
               path={`${match.url}`}
               render={(props) => (
                  <LoginForm
                     {...this.state}
                     {...props}
                     appTitle={account.url && account.url.title}
                     contractId={account.url && account.url.contract_id}
                     handleOnClick={this.handleOnClick}
                     handleDeny={this.handleDeny}
                     handleAllow={this.handleAllow}
                     handleSelectAccount={this.handleSelectAccount}
                     redirectCreateAccount={this.redirectCreateAccount}
                     handleDetails={this.handleDetails}
                  />
               )}
            />
            <Route 
               exact
               path={`${match.url}/details`}
               render={(props) => (
                  <LoginDetails
                     {...props}
                     contractId={account.url && account.url.contract_id}
                     appTitle={account.url && account.url.title}
                  />
               )}
            />
            <Route 
               exact
               path={`${match.url}/confirm`}
               render={(props) => (
                  <LoginConfirm
                     {...props}
                     buttonLoader={this.state.buttonLoader}
                     appTitle={account.url && account.url.title}
                     handleAllow={this.handleAllow}
                  />
               )}
            />
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
