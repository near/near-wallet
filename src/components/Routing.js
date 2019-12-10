import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { withLocalize } from 'react-localize-redux';
import { parse, stringify } from 'query-string'

import translations_en from '../translations/en.global.json'

import '../index.css'

import ResponsiveContainer from './responsive/ResponsiveContainer'
import Footer from './common/Footer'
import PrivateRoute from './common/PrivateRoute'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { SetRecoveryInfoWithRouter } from './accounts/SetRecoveryInfo'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase'
import { LoginWithRouter } from './login/Login'
import { ContactsWithRouter } from './contacts/Contacts'
import { AuthorizedAppsWithRouter } from './access-keys/AccessKeys'
import { FullAccessKeysWithRouter } from './access-keys/AccessKeys'
import { SendMoneyWithRouter } from './send-money/SendMoney'
import { ProfileWithRouter } from './profile/Profile'
import { SignWithRouter } from './sign/Sign'
import { NodeStakingWithRouter } from './node-staking/NodeStaking'
import { AddNodeWithRouter } from './node-staking/AddNode'
import { NodeDetailsWithRouter } from './node-staking/NodeDetails'
import { StakingWithRouter } from './node-staking/Staking'

import { handleRefreshAccount, handleRefreshUrl, clearAlert, clear } from '../actions/account'

import GlobalStyle from './GlobalStyle'
import { SetupSeedPhraseWithRouter } from './accounts/SetupSeedPhrase'
const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

class Routing extends Component {
   constructor(props) {
      super(props)

      this.props.initialize({
         languages: [
            { name: "English", code: "en" },
         ],
         translation: {},
         options: {
            renderToStaticMarkup: false
         }
      })
      this.props.addTranslationForLanguage(translations_en, "en")
   }
   
   componentDidMount = () => {
      const { handleRefreshAccount, handleRefreshUrl, history, account, clearAlert, clear } = this.props
      
      if (!account.accountId) {
         const redirectUrl = history.location.pathname
         history.location.search = stringify({...parse(history.location.search), redirect_url: redirectUrl})
      }
      
      handleRefreshAccount(history)
      handleRefreshUrl(history.location)

      history.listen(() => {
         handleRefreshAccount(history, false)
         
         const { state: { globalAlertPreventClear } = {} } = history.location
         if (!globalAlertPreventClear) {
            clearAlert()
         }
         
         clear()
      })
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
                           <PrivateRoute
                              exact
                              path='/setup-seed-phrase/:accountId/:verify?'
                              component={SetupSeedPhraseWithRouter}
                           />
                           <Route
                              exact
                              path='/recover-account'
                              component={RecoverAccountWithRouter}
                           />
                           <Route
                              exact
                              path='/recover-seed-phrase'
                              component={RecoverAccountSeedPhraseWithRouter}
                           />
                           <PrivateRoute
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
                              exact
                              path='/node-staking'
                              component={NodeStakingWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/add-node'
                              component={AddNodeWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/node-details'
                              component={NodeDetailsWithRouter}
                           />
                           <PrivateRoute
                              exact
                              path='/staking'
                              component={StakingWithRouter}
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
   handleRefreshUrl,
   clearAlert,
   clear
}

const mapStateToProps = ({ account }) => ({
   account
})

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withLocalize(Routing))
