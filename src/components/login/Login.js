import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'

import LoginContainer from './LoginContainer'
import LoginForm from './LoginForm'
import LoginConfirm from './LoginConfirm'
import LoginDetails from './LoginDetails'

import { handleRefreshAccount, handleRefreshUrl, switchAccount, clearAlert, allowLogin, handleLoginUrl } from '../../actions/account'

class Login extends Component {
   state = {
      buttonLoader: false,
      dropdown: false,
   }

   componentDidMount = () => {
      this.props.handleLoginUrl()
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

      this.props.allowLogin()
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
   allowLogin,
   clearAlert,
   handleLoginUrl
}

const mapStateToProps = ({ account }) => ({
    account
})

export const LoginWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Login))
