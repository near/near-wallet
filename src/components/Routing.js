import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { withLocalize } from 'react-localize-redux';

import translations_en from '../translations/en.global.json'
import GlobalAlert from './responsive/GlobalAlert'
import '../index.css'

import Navigation from './navigation/Navigation'
import Footer from './common/Footer'
import NetworkBanner from './common/NetworkBanner'
import PrivateRoute from './common/PrivateRoute'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { SetupRecoveryMethodWithRouter } from './accounts/recovery_setup/SetupRecoveryMethod'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase'
import { RecoverWithLinkWithRouter } from './accounts/RecoverWithLink'
import { LoginWithRouter } from './login/Login'
import { ContactsWithRouter } from './contacts/Contacts'
import { AuthorizedAppsWithRouter } from './access-keys/AccessKeys'
import { FullAccessKeysWithRouter } from './access-keys/AccessKeys'
import { SendMoneyWithRouter } from './send-money/SendMoney'
import { ReceiveMoneyWithRouter } from './receive-money/ReceiveMoney'
import { Profile } from './profile/Profile'
import { SignWithRouter } from './sign/Sign'
import { NodeStakingWithRouter } from './node-staking/NodeStaking'
import { AddNodeWithRouter } from './node-staking/AddNode'
import { NodeDetailsWithRouter } from './node-staking/NodeDetails'
import { StakingWithRouter } from './node-staking/Staking'
import { IS_MAINNET } from '../utils/wallet'
import { refreshAccount, handleRefreshUrl, clearAlert, clear, handleRedirectUrl, handleClearUrl } from '../actions/account'

import GlobalStyle from './GlobalStyle'
import { SetupSeedPhraseWithRouter } from './accounts/SetupSeedPhrase'
const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

const Container = styled.div`
    min-height: 100vh;
    padding-bottom: 200px;
    padding-top: ${props => props.mainnet ? '75px' : '120px'};
    .main {
        padding-bottom: 200px;
    }

    @media (max-width: 991px) {
        .App {
            .main {
                padding-bottom: 0px;
            }
        }
    }
`
class Routing extends Component {
    constructor(props) {
        super(props)

        this.props.initialize({
            languages: [
                { name: "English", code: "en" },
            ],
            translation: {},
            options: {
                renderToStaticMarkup: false,
                renderInnerHtml: true
            }
        })
        this.props.addTranslationForLanguage(translations_en, "en")
    }

    componentDidMount = () => {
        const { refreshAccount, handleRefreshUrl, history, clearAlert, clear, handleRedirectUrl, handleClearUrl } = this.props
        
        handleRefreshUrl()
        refreshAccount()

        history.listen(() => {
            handleRedirectUrl(this.props.router.location)
            handleClearUrl()
            refreshAccount()
            
            const { state: { globalAlertPreventClear } = {} } = history.location
            if (!globalAlertPreventClear) {
                clearAlert()
            }

            clear()
        })
    }

    render() {

        return (
            <Container className='App' mainnet={IS_MAINNET ? true : false}>
                <GlobalStyle />
                <ConnectedRouter basename={PATH_PREFIX}  history={this.props.history}>
                    <ThemeProvider theme={theme}>
                        <NetworkBanner/>
                        <Navigation/>
                        <GlobalAlert/>
                        {this.props.account.loader === false && (
                            <Switch>
                                <PrivateRoute
                                    exact
                                    path='/'
                                    component={DashboardDetailWithRouter}
                                />
                                <Route
                                    exact
                                    path='/create/:fundingContract?/:fundingKey?'
                                    component={CreateAccountWithRouter}
                                />
                                <PrivateRoute
                                    exact
                                    path='/set-recovery/:accountId'
                                    component={SetupRecoveryMethodWithRouter}
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
                                    path='/recover-seed-phrase/:accountId?/:seedPhrase?'
                                    component={RecoverAccountSeedPhraseWithRouter}
                                />
                                <Route
                                    exact
                                    path='/recover-with-link/:accountId?/:seedPhrase?'
                                    component={RecoverWithLinkWithRouter}
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
                                    path='/receive-money'
                                    component={ReceiveMoneyWithRouter}
                                />
                                <PrivateRoute
                                    exact
                                    path='/profile/:accountId'
                                    component={Profile}
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
                    </ThemeProvider>
                </ConnectedRouter>
            </Container>
        )
    }
}

Routing.propTypes = {
    history: PropTypes.object.isRequired
}

const mapDispatchToProps = {
    refreshAccount,
    handleRefreshUrl,
    clearAlert,
    clear,
    handleRedirectUrl,
    handleClearUrl
}

const mapStateToProps = ({ account, router }) => ({
    account,
    router
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withLocalize(Routing))
