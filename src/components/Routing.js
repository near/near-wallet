import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import '../index.css'

import ResponsiveContainer from './responsive/ResponsiveContainer'
import Footer from './common/Footer'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { SetRecoveryInfoWithRouter } from './accounts/SetRecoveryInfo'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { LoginWithRouter } from './login/Login'
import { ContactsWithRouter } from './contacts/Contacts'
import { AuthorizedAppsWithRouter } from './authorized-apps/AuthorizedApps'
import { SendMoneyWithRouter } from './send-money/SendMoney'
import { ProfileWithRouter } from './profile/Profile'

import { handleRefreshAccount, handleRefreshUrl } from '../actions/account'

import { ThemeProvider } from 'styled-components'
import GlobalStyle from './GlobalStyle'
const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

class Routing extends Component {
   componentDidMount = () => {
      const { handleRefreshAccount, history } = this.props
      handleRefreshAccount(history)
      history.listen(() => {
         handleRefreshAccount(history, false)
      })
   }

   render() {
      return (
         <div className='App'>
            <GlobalStyle />

            <ConnectedRouter basename={PATH_PREFIX}  history={this.props.history}>
               <ThemeProvider theme={theme}>
                  <ResponsiveContainer>
                     <Switch>
                        <Route
                           exact
                           path='/'
                           component={DashboardDetailWithRouter}
                        />
                        <Route
                           exact
                           path='/create'
                           component={CreateAccountWithRouter}
                        />
                        <Route
                           exact
                           path='/set-recovery/:accountId'
                           component={SetRecoveryInfoWithRouter}
                        />
                        <Route
                           exact
                           path='/recover-account'
                           component={RecoverAccountWithRouter}
                        />
                        <Route
                           exact
                           path='/login'
                           component={LoginWithRouter}
                        />
                        <Route
                           exact
                           path='/contacts'
                           component={ContactsWithRouter}
                        />
                        <Route
                           exact
                           path='/authorized-apps'
                           component={AuthorizedAppsWithRouter}
                        />
                        <Route
                           exact
                           path='/send-money/:id?'
                           component={SendMoneyWithRouter}
                        />
                        <Route
                           exact
                           path='/profile'
                           component={ProfileWithRouter}
                        />

                        <Route component={DashboardDetailWithRouter} />
                     </Switch>
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

const mapStateToProps = () => ({})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Routing)
