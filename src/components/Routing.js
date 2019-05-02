import React, { Component } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import '../index.css'

import ResponsiveContainer from './responsive/ResponsiveContainer'
import Footer from './common/Footer'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { LoginWithRouter } from './login/Login'
import { ContactsWithRouter } from './contacts/Contacts'
import { AuthorizedAppsWithRouter } from './authorized-apps/AuthorizedApps'
import { SendMoneyWithRouter } from './send-money/SendMoney'
import { ProfileWithRouter } from './profile/Profile'

import { ThemeProvider } from 'styled-components'
import GlobalStyle from './GlobalStyle'
const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

class Routing extends Component {
   render() {
      return (
         <div className='App'>
            <GlobalStyle />

            <Router basename={PATH_PREFIX}>
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
                           path='/send-money'
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
            </Router>
         </div>
      )
   }
}

export default Routing
