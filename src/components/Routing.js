import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import '../index.css'

import ResponsiveContainer from './responsive/ResponsiveContainer'
import Footer from './common/Footer'
import PrivateRoute from './common/PrivateRoute'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { SetRecoveryInfoWithRouter } from './accounts/SetRecoveryInfo'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { LoginWithRouter } from './login/Login'
import { ContactsWithRouter } from './contacts/Contacts'
import { AuthorizedAppsWithRouter } from './access-keys/AccessKeys'
import { FullAccessKeysWithRouter } from './access-keys/AccessKeys'
import { SendMoneyWithRouter } from './send-money/SendMoney'
import { ProfileWithRouter } from './profile/Profile'
import { SignWithRouter } from './sign/Sign'

import { handleRefreshAccount, handleRefreshUrl } from '../actions/account'

import { ThemeProvider } from 'styled-components'
import GlobalStyle from './GlobalStyle'
const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

class Routing extends Component {
   componentDidMount = () => {
      const { handleRefreshAccount, handleRefreshUrl, history } = this.props

      handleRefreshAccount(history)
      handleRefreshUrl(this.props.history.location)

      history.listen(() => handleRefreshAccount(history, false))
   }

   render() {
      return (
         <div className='App'>
            <GlobalStyle />

            <ConnectedRouter basename={PATH_PREFIX}  history={this.props.history}>
               <ThemeProvider theme={theme}>
                  <ResponsiveContainer>
                     {this.props.account.loader === false && (
                        <Switch>
                           <PrivateRoute
                              exact
                              path='/'
                              component={DashboardDetailWithRouter}
                           />
                           <Route
                              exact
                              path='/create'
                              component={CreateAccountWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/set-recovery/:accountId'
                              component={SetRecoveryInfoWithRouter}
                           />
                           <Route
                              exact
                              path='/recover-account'
                              component={RecoverAccountWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/login'
                              component={LoginWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/contacts'
                              component={ContactsWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/authorized-apps'
                              component={AuthorizedAppsWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/full-access-keys'
                              component={FullAccessKeysWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/send-money/:id?'
                              component={SendMoneyWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/profile'
                              component={ProfileWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/sign'
                              component={SignWithRouter}
                           />
                           <PrivateRoute 
                              component={DashboardDetailWithRouter} 
                           />
                        </Switch>
                     )}
                     <Footer />
                  </ResponsiveContainer>
               </ThemeProvider>
            </ConnectedRouter>
         </div>
      )
   }
}

Routing.propTypes = {
   history: PropTypes.object.isRequired
}

const mapDispatchToProps = {
   handleRefreshAccount,
   handleRefreshUrl
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Routing)
