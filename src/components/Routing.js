import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { withLocalize } from 'react-localize-redux'
import translations_en from '../translations/en.global.json'
import translations_ru from '../translations/ru.global.json'
import translations_zh_hans from '../translations/zh-hans.global.json'
import translations_zh_hant from '../translations/zh-hant.global.json'
import ScrollToTop from '../utils/ScrollToTop'
import GlobalAlert from './responsive/GlobalAlert'
import '../index.css'

import Navigation from './navigation/Navigation'
import Footer from './common/Footer'
import NetworkBanner from './common/NetworkBanner'
import PrivateRoute from './common/PrivateRoute'
import DashboardDetailWithRouter from './dashboard/DashboardDetail'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { SetupRecoveryMethodWithRouter } from './accounts/recovery_setup/SetupRecoveryMethod'
import { SetupLedgerWithRouter } from './accounts/ledger/SetupLedger'
import { SetupLedgerSuccessWithRouter } from './accounts/ledger/SetupLedgerSuccess'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase'
import { RecoverWithLinkWithRouter } from './accounts/RecoverWithLink'
import { SignInLedger } from './accounts/ledger/SignInLedger'
import { LoginWithRouter } from './login/Login'
import { LoginCliLoginSuccess } from './login/LoginCliLoginSuccess'
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

const onMissingTranslation = ({ translationId }) => {
    return `${translationId}`
  };

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
        const languages = [
            { name: "English", code: "en" },
            { name: "Русский", code: "ru" },
            { name: "简体中文", code: "zh-hans" },
            { name: "繁體中文", code: "zh-hant" }
        ]
        
        const defaultLanguage = localStorage.getItem("languageCode") || languages[0].code

        this.props.initialize({
            languages,
            options: {
                defaultLanguage,
                onMissingTranslation,
                renderToStaticMarkup: false,
                renderInnerHtml: true
            }
        })
        
        // TODO: Figure out how to load only necessary translations dynamically
        this.props.addTranslationForLanguage(translations_en, "en")
        this.props.addTranslationForLanguage(translations_ru, "ru")
        this.props.addTranslationForLanguage(translations_zh_hans, "zh-hans")
        this.props.addTranslationForLanguage(translations_zh_hant, "zh-hant")
        // this.addTranslationsForActiveLanguage(defaultLanguage)
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
            if (!globalAlertPreventClear && !this.props.account.globalAlertPreventClear) {
                clearAlert()
            }

            clear()
        })
    }

    componentDidUpdate(prevProps) {
        const prevLangCode = prevProps.activeLanguage && prevProps.activeLanguage.code
        const curLangCode = this.props.activeLanguage && this.props.activeLanguage.code
        const hasLanguageChanged = prevLangCode !== curLangCode

        if (hasLanguageChanged) {
            // this.addTranslationsForActiveLanguage(curLangCode)
            localStorage.setItem("languageCode", curLangCode)
        }
    }

    // addTranslationsForActiveLanguage(activeLang) {
    //     import(`../translations/${activeLang}.global.json`).then(
    //         translations => {
    //             console.log(translations)
    //             this.props.addTranslationForLanguage(translations, activeLang);
    //         }
    //     );
    // }

    render() {

        return (
            <Container className='App' mainnet={IS_MAINNET ? true : false}>
                <GlobalStyle />
                <ConnectedRouter basename={PATH_PREFIX}  history={this.props.history}>
                    <ThemeProvider theme={theme}>
                        <ScrollToTop/>
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
                                    path='/setup-ledger'
                                    component={SetupLedgerWithRouter}
                                />
                                <PrivateRoute
                                    exact
                                    path='/setup-ledger-success'
                                    component={SetupLedgerSuccessWithRouter}
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
                                    path='/recover-seed-phrase/:seedPhrase?'
                                    component={RecoverAccountSeedPhraseWithRouter}
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
                                <Route
                                    exact
                                    path='/sign-in-ledger'
                                    component={SignInLedger}
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
                                {!IS_MAINNET &&
                                    <PrivateRoute
                                        exact
                                        path='/send-money/:id?'
                                        component={SendMoneyWithRouter}
                                    />
                                }
                                {!IS_MAINNET &&
                                    <PrivateRoute
                                        exact
                                        path='/receive-money'
                                        component={ReceiveMoneyWithRouter}
                                    />
                                }
                                <PrivateRoute
                                    exact
                                    path='/profile/:accountId?'
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
                                <Route
                                    exact
                                    path='/cli-login-success'
                                    component={LoginCliLoginSuccess}
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
