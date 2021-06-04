import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'

import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { withLocalize } from 'react-localize-redux'
import translations_en from '../translations/en.global.json'
import translations_pt from '../translations/pt.global.json'
import translations_ru from '../translations/ru.global.json'
import translations_zh_hans from '../translations/zh-hans.global.json'
import translations_zh_hant from '../translations/zh-hant.global.json'
import ScrollToTop from '../utils/ScrollToTop'
import GlobalAlert from './common/GlobalAlert'
import '../index.css'
import Navigation from './navigation/Navigation'
import Footer from './common/Footer'
import NetworkBanner from './common/NetworkBanner'
import TwoFactorVerifyModal from '../components/accounts/two_factor/TwoFactorVerifyModal'
import PrivateRoute from './common/PrivateRoute'
import PrivateRouteLimited from './common/PrivateRouteLimited'
import GuestLandingRoute from './common/GuestLandingRoute'
import { Wallet } from './wallet/Wallet'
import { CreateAccountWithRouter } from './accounts/CreateAccount'
import { LinkdropLandingWithRouter } from './accounts/LinkdropLanding'
import { SetupRecoveryMethodWithRouter } from './accounts/recovery_setup/SetupRecoveryMethod'
import { SetupLedgerWithRouter } from './accounts/ledger/SetupLedger'
import { SetupLedgerSuccessWithRouter } from './accounts/ledger/SetupLedgerSuccess'
import { EnableTwoFactor } from './accounts/two_factor/EnableTwoFactor'
import { RecoverAccountWithRouter } from './accounts/RecoverAccount'
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase'
import { RecoverWithLinkWithRouter } from './accounts/RecoverWithLink'
import { SignInLedger } from './accounts/ledger/SignInLedger'
import { LoginWithRouter } from './login/Login'
import { LoginCliLoginSuccess } from './login/LoginCliLoginSuccess'
import { AuthorizedAppsWithRouter } from './access-keys/AccessKeys'
import { FullAccessKeysWithRouter } from './access-keys/AccessKeys'
import { SendContainer } from './send/SendContainer'
import { ReceiveMoneyWithRouter } from './receive-money/ReceiveMoney'
import { Profile } from './profile/Profile'
import { BuyNear } from './buy/BuyNear'
import { SignWithRouter } from './sign/Sign'
import { StakingContainer } from './staking/StakingContainer'
import { WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS, IS_MAINNET, SHOW_PRERELEASE_WARNING } from '../utils/wallet'
import { refreshAccount, handleRefreshUrl, handleRedirectUrl, handleClearUrl, promptTwoFactor, redirectTo } from '../actions/account'
import LedgerConfirmActionModal from './accounts/ledger/LedgerConfirmActionModal';

import GlobalStyle from './GlobalStyle'
import { SetupSeedPhraseWithRouter } from './accounts/SetupSeedPhrase'
import { SetupImplicitWithRouter } from './accounts/SetupImplicit'
import { SetupImplicitSuccess } from './accounts/SetupImplicitSuccess'
import { ActivateAccountWithRouter } from './accounts/create/ActivateAccount'
import { handleClearAlert} from '../utils/alerts'
import { Mixpanel } from "../mixpanel/index";
import classNames from '../utils/classNames';
import Terms from './terms/Terms'

const theme = {}

const PATH_PREFIX = process.env.PUBLIC_URL

const Container = styled.div`
    min-height: 100vh;
    padding-bottom: 200px;
    padding-top: 75px;
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

    &.network-banner {
        @media (max-width: 450px) {
            .alert-banner, .lockup-avail-transfer {
                margin-top: -35px;
            }
        }
    }
`
class Routing extends Component {
    constructor(props) {
        super(props);
        const languages = [
            { name: "English", code: "en" },
            { name: "Português", code: "pt" },
            { name: "Русский", code: "ru" },
            { name: "简体中文", code: "zh-hans" },
            { name: "繁體中文", code: "zh-hant" }
        ]

        const activeLang = localStorage.getItem("languageCode") || languages[0].code

        this.props.initialize({
            languages,
            options: {
                defaultLanguage: 'en',
                onMissingTranslation: ({ defaultTranslation }) => defaultTranslation,
                renderToStaticMarkup: false,
                renderInnerHtml: true
            }
        })

        // TODO: Figure out how to load only necessary translations dynamically
        this.props.addTranslationForLanguage(translations_en, "en")
        this.props.addTranslationForLanguage(translations_pt, "pt")
        this.props.addTranslationForLanguage(translations_ru, "ru")
        this.props.addTranslationForLanguage(translations_zh_hans, "zh-hans")
        this.props.addTranslationForLanguage(translations_zh_hant, "zh-hant")

        this.props.setActiveLanguage(activeLang)
        // this.addTranslationsForActiveLanguage(defaultLanguage)
    }

    componentDidMount = async () => {
        const {
            refreshAccount,
            handleRefreshUrl,
            history,
            handleRedirectUrl,
            handleClearUrl,
            router
        } = this.props

        //localStorage.setItem(`wallet:account:efww4r23aer.testnet:inactive`, true)

        handleRefreshUrl(router)
        refreshAccount()

        history.listen(async () => {
            handleRedirectUrl(this.props.router.location)
            handleClearUrl()
            if (!WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS.find((path) => this.props.router.location.pathname.indexOf(path) > -1)) {
                await refreshAccount(true)
            }

            handleClearAlert()
        })
    }

    componentDidUpdate(prevProps) {
        const { activeLanguage, account, redirectTo } = this.props;

        if (account.accountId !== prevProps.account.accountId && account.accountId !== undefined) {
            //FIX: Make call to backend to check if account is inactive and then set localStorage
            if (localStorage.getItem(`wallet:account:${account.accountId}:inactive`)) {
                redirectTo('/')
            }
            //FIX: Check and clear localStorage even if it account comes back as active
        }

        const prevLangCode = prevProps.activeLanguage && prevProps.activeLanguage.code
        const curLangCode = activeLanguage && activeLanguage.code
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
        const { search } = this.props.router.location
        const { account } = this.props;
        const inactiveAccount = localStorage.getItem(`wallet:account:${account.localStorage?.accountId || account.accountId}:inactive`)

        return (
            <Container className={classNames(['App', {'network-banner': (!IS_MAINNET || SHOW_PRERELEASE_WARNING)}])} id='app-container'>
                <GlobalStyle />
                <ConnectedRouter basename={PATH_PREFIX} history={this.props.history}>
                    <ThemeProvider theme={theme}>
                        <ScrollToTop/>
                        <NetworkBanner
                            account={account}
                        />
                        <Navigation inactiveAccount={inactiveAccount}/>
                        <GlobalAlert/>
                        <LedgerConfirmActionModal/>
                        {
                            account.requestPending !== null &&
                            <TwoFactorVerifyModal
                                onClose={(verified, error) => {
                                    const { account, promptTwoFactor } = this.props
                                    Mixpanel.track("2FA Modal Verify start")
                                    // requestPending will resolve (verified == true) or reject the Promise being awaited in the method that dispatched promptTwoFactor
                                    account.requestPending(verified, error)
                                    // clears requestPending and closes the modal
                                    promptTwoFactor(null)
                                    if (error) {
                                        // tracking error
                                        Mixpanel.track("2FA Modal Verify fail", {error: error.message})
                                    }
                                    if (verified) {
                                        Mixpanel.track("2FA Modal Verify finish")
                                    }
                                }}
                            />
                        }
                        <Switch>
                            <Redirect from="//*" to={{
                                pathname: '/*',
                                search: search
                            }} />
                            <GuestLandingRoute
                                exact
                                path='/' 
                                component={inactiveAccount ? ActivateAccountWithRouter : Wallet}
                                accountFound={this.props.account.localStorage?.accountFound}
                            />
                            <Route
                                exact
                                path='/linkdrop/:fundingContract?/:fundingKey?'
                                component={LinkdropLandingWithRouter}
                            />
                            <Route
                                exact
                                path='/create/:fundingContract?/:fundingKey?'
                                component={CreateAccountWithRouter}
                            />
                            <Route
                                exact
                                path={'/create-from/:fundingAccountId'}
                                component={CreateAccountWithRouter}
                            />
                            <Route
                                exact
                                path='/set-recovery/:accountId/:fundingContract?/:fundingKey?'
                                component={SetupRecoveryMethodWithRouter}
                            />
                            <Route
                                exact
                                path='/setup-seed-phrase/:accountId/:step'
                                component={SetupSeedPhraseWithRouter}
                            />
                            <Route
                                exact
                                path='/fund-create-account/:accountId/:implicitAccountId/:recoveryMethod'
                                component={SetupImplicitWithRouter}
                            />
                            <Route
                                exact
                                path='/fund-create-account/success'
                                component={SetupImplicitSuccess}
                            />
                            <Route
                                exact
                                path='/setup-ledger/:accountId'
                                component={SetupLedgerWithRouter}
                            />
                            <PrivateRoute
                                exact
                                path='/setup-ledger-success'
                                component={SetupLedgerSuccessWithRouter}
                            />
                            <PrivateRoute
                                exact
                                path='/enable-two-factor'
                                component={EnableTwoFactor}
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
                            <Route
                                exact
                                path='/sign-in-ledger'
                                component={SignInLedger}
                            />
                            <PrivateRouteLimited
                                path='/login'
                                component={LoginWithRouter}
                            />
                            <PrivateRouteLimited
                                exact
                                path='/authorized-apps'
                                component={AuthorizedAppsWithRouter}
                            />
                            <PrivateRouteLimited
                                exact
                                path='/full-access-keys'
                                component={FullAccessKeysWithRouter}
                            />
                            {!inactiveAccount &&
                                <PrivateRouteLimited
                                    exact
                                    path='/send-money/:id?'
                                    component={SendContainer}
                                />
                            }
                            <PrivateRouteLimited
                                exact
                                path='/receive-money'
                                component={ReceiveMoneyWithRouter}
                            />
                            <PrivateRouteLimited
                                exact
                                path='/buy'
                                component={BuyNear}
                            />
                            <Route
                                exact
                                path='/profile/:accountId'
                                component={Profile}
                            />
                            {!inactiveAccount &&
                                <PrivateRouteLimited
                                    exact
                                    path='/profile/:accountId?'
                                    component={Profile}
                                />
                            }
                            <PrivateRouteLimited
                                exact
                                path='/sign'
                                component={SignWithRouter}
                            />
                            {!inactiveAccount &&
                                <PrivateRouteLimited
                                    path='/staking'
                                    component={StakingContainer}
                                    render={() => (
                                        <StakingContainer
                                            history={this.props.history}
                                        />
                                    )}
                                />
                            }
                            <Route
                                exact
                                path='/cli-login-success'
                                component={LoginCliLoginSuccess}
                            />
                            <Route
                                exact
                                path='/terms'
                                component={Terms}
                            />
                            <PrivateRouteLimited
                                component={inactiveAccount ? ActivateAccountWithRouter : Wallet}
                            />
                        </Switch>
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
    handleRedirectUrl,
    handleClearUrl,
    promptTwoFactor,
    redirectTo
}

const mapStateToProps = ({ account, router }) => ({
    account,
    router
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withLocalize(Routing))
