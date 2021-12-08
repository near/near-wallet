import { ConnectedRouter, getRouter } from 'connected-react-router';
import isString from 'lodash.isstring';
import { parseSeedPhrase } from 'near-seed-phrase';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import TwoFactorVerifyModal from '../components/accounts/two_factor/TwoFactorVerifyModal';
import { IS_MAINNET, PUBLIC_URL, SHOW_PRERELEASE_WARNING } from '../config';
import { Mixpanel } from "../mixpanel/index";
import * as accountActions from '../redux/actions/account';
import { selectAccountSlice } from '../redux/slices/account';
import { actions as tokenFiatValueActions } from '../redux/slices/tokenFiatValues';
import { LoginWrapper } from '../routes/LoginWrapper';
import translations_en from '../translations/en.global.json';
import translations_pt from '../translations/pt.global.json';
import translations_ru from '../translations/ru.global.json';
import translations_vi from '../translations/vi.global.json';
import translations_zh_hans from '../translations/zh-hans.global.json';
import translations_zh_hant from '../translations/zh-hant.global.json';
import { handleClearAlert } from '../utils/alerts';
import classNames from '../utils/classNames';
import getBrowserLocale from '../utils/getBrowserLocale';
import { getAccountIsInactive, removeAccountIsInactive, setAccountIsInactive } from '../utils/localStorage';
import { reportUiActiveMixpanelThrottled } from '../utils/reportUiActiveMixpanelThrottled';
import ScrollToTop from '../utils/ScrollToTop';
import { 
    WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS,
    WALLET_LOGIN_URL,
    WALLET_SIGN_URL,
    WALLET_SEND_MONEY_URL,
} from '../utils/wallet';
import AccessKeysWrapper from './access-keys/v2/AccessKeysWrapper';
import { AutoImportWrapper } from './accounts/auto_import/AutoImportWrapper';
import { ActivateAccountWithRouter } from './accounts/create/ActivateAccount';
import { ExistingAccountWrapper } from './accounts/create/existing_account/ExistingAccountWrapper';
import { InitialDepositWrapper } from './accounts/create/initial_deposit/InitialDepositWrapper';
import { VerifyAccountWrapper } from './accounts/create/verify_account/VerifyAccountWrapper';
import { CreateAccountWithRouter } from './accounts/CreateAccount';
import LedgerConfirmActionModal from './accounts/ledger/LedgerConfirmActionModal';
import { SetupLedgerWithRouter } from './accounts/ledger/SetupLedger';
import { SetupLedgerSuccessWithRouter } from './accounts/ledger/SetupLedgerSuccess';
import { SignInLedger } from './accounts/ledger/SignInLedger';
import { LinkdropLandingWithRouter } from './accounts/LinkdropLanding';
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase';
import { RecoverAccountWrapper } from './accounts/RecoverAccountWrapper';
import { RecoverWithLinkWithRouter } from './accounts/RecoverWithLink';
import { SetupRecoveryMethodWithRouter } from './accounts/recovery_setup/SetupRecoveryMethod';
import { SetupImplicitWithRouter } from './accounts/SetupImplicit';
import { SetupSeedPhraseWithRouter } from './accounts/SetupSeedPhrase';
import { EnableTwoFactor } from './accounts/two_factor/EnableTwoFactor';
import { BuyNear } from './buy/BuyNear';
import Footer from './common/Footer';
import GlobalAlert from './common/GlobalAlert';
import GuestLandingRoute from './common/GuestLandingRoute';
import NetworkBanner from './common/NetworkBanner';
import PrivateRoute from './common/PrivateRoute';
import PublicRoute from './common/PublicRoute';
import GlobalStyle from './GlobalStyle';
import { LoginCliLoginSuccess } from './login/LoginCliLoginSuccess';
import Navigation from './navigation/Navigation';
import {PageNotFound} from './page-not-found/PageNotFound';
import { Profile } from './profile/Profile';
import { ReceiveContainerWrapper } from './receive-money/ReceiveContainerWrapper';
import { SendContainerWrapper } from './send/SendContainerWrapper';
import { SignWithRouter } from './sign/Sign';
import { StakingContainer } from './staking/StakingContainer';
import Terms from './terms/Terms';
import { Wallet } from './wallet/Wallet';

import '../index.css';

const { 
    fetchTokenFiatValues
} = tokenFiatValueActions;

const  {
    getAccountHelperWalletState,
    handleClearUrl,
    handleRedirectUrl,
    handleRefreshUrl,
    promptTwoFactor,
    redirectTo,
    refreshAccount
} = accountActions;

const theme = {};

const PATH_PREFIX = PUBLIC_URL;

const Container = styled.div`
    min-height: 100vh;
    padding-bottom: 230px;
    padding-top: 75px;
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
                margin-top: -45px;
            }
        }
    }

    @media (max-width: 767px) {
        &.hide-footer-mobile { 
            .wallet-footer {
                display: none;
            }
        }
    }
`;
class Routing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isInactiveAccount: null
        };

        this.pollTokenFiatValue = null;

        const languages = [
            { name: "English", code: "en" },
            { name: "Português", code: "pt" },
            { name: "Русский", code: "ru" },
            { name: "Tiếng Việt", code: "vi" },
            { name: "简体中文", code: "zh-hans" },
            { name: "繁體中文", code: "zh-hant" }
        ];

        const browserLanguage = getBrowserLocale(languages.map(l => l.code));
        const activeLang = localStorage.getItem("languageCode") || browserLanguage || languages[0].code;

        this.props.initialize({
            languages,
            options: {
                defaultLanguage: 'en',
                onMissingTranslation: ({ translationId, defaultTranslation }) => {
                    if (isString(defaultTranslation)) {
                        // do anything to change the defaultTranslation as you wish
                        return defaultTranslation;
                    } else {
                        // that's the code that can fix the issue
                        return ReactDOMServer.renderToStaticMarkup(defaultTranslation);
                    }
                },
                renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup,
                renderInnerHtml: true
            }
        });

        // TODO: Figure out how to load only necessary translations dynamically
        this.props.addTranslationForLanguage(translations_en, "en");
        this.props.addTranslationForLanguage(translations_pt, "pt");
        this.props.addTranslationForLanguage(translations_ru, "ru");
        this.props.addTranslationForLanguage(translations_zh_hans, "zh-hans");
        this.props.addTranslationForLanguage(translations_zh_hant, "zh-hant");
        this.props.addTranslationForLanguage(translations_vi, "vi");

        this.props.setActiveLanguage(activeLang);
        // this.addTranslationsForActiveLanguage(defaultLanguage)
    }

    componentDidMount = async () => {
        const {
            refreshAccount,
            handleRefreshUrl,
            history,
            handleRedirectUrl,
            handleClearUrl,
            router,
            fetchTokenFiatValues
        } = this.props;
        
        fetchTokenFiatValues();
        this.startPollingTokenFiatValue();
        handleRefreshUrl(router);
        refreshAccount();

        history.listen(async () => {
            handleRedirectUrl(this.props.router.location);
            handleClearUrl();
            if (!WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS.find((path) => this.props.router.location.pathname.indexOf(path) > -1)) {
                await refreshAccount(true);
            }

            handleClearAlert();
        });
    }

    componentDidUpdate(prevProps) {
        const { activeLanguage, account, getAccountHelperWalletState } = this.props;

        if (prevProps.account.localStorage?.accountId !== account.localStorage?.accountId) {
            this.setState({ isInactiveAccount: getAccountIsInactive(`${account.accountId || account.localStorage?.accountId}`) });
        }

        if (prevProps.account.accountId !== account.accountId && account.accountId !== undefined) {
            getAccountHelperWalletState(account.accountId);
        }

        if (prevProps.account.accountHelperWalletState.isLoaded !== account.accountHelperWalletState.isLoaded) {
            const needsDeposit = account.accountHelperWalletState.fundedAccountNeedsDeposit;
            const accountId = account.accountId || account.localStorage?.accountId;

            this.setState({ isInactiveAccount: needsDeposit });

            if (!needsDeposit) {
                removeAccountIsInactive(accountId);
            } else {
                setAccountIsInactive(accountId);
            }
        }

        const prevLangCode = prevProps.activeLanguage && prevProps.activeLanguage.code;
        const curLangCode = activeLanguage && activeLanguage.code;
        const hasLanguageChanged = prevLangCode !== curLangCode;

        if (hasLanguageChanged) {
            // this.addTranslationsForActiveLanguage(curLangCode)
            localStorage.setItem("languageCode", curLangCode);
        }
    }

    componentWillUnmount = () => {
        this.stopPollingTokenFiatValue();
    }

    startPollingTokenFiatValue = () => {
        const { fetchTokenFiatValues  } = this.props;

        const handlePollTokenFiatValue = async () => {
            await fetchTokenFiatValues().catch(() => {});
            if (this.pollTokenFiatValue) {
                this.pollTokenFiatValue = setTimeout(() => handlePollTokenFiatValue(), 30000);
            }
        };
        this.pollTokenFiatValue = setTimeout(() => handlePollTokenFiatValue(), 30000);
    }

    stopPollingTokenFiatValue = () => {
        clearTimeout(this.pollTokenFiatValue);
        this.pollTokenFiatValue = null;
    }

    render() {
        const { search, query: { tab }, hash, pathname } = this.props.router.location;
        const { account } = this.props;
        const setTab = (nextTab) => {
            if (tab !== nextTab) {
                const destinationSearch = new URLSearchParams(search);

                if (nextTab) {
                    destinationSearch.set('tab', nextTab);
                } else {
                    destinationSearch.delete('tab');
                }

                // Ensure any `hash` value remains in the URL when we toggle tab
                this.props.history.push({ search: destinationSearch.toString(), hash });
            }
        };
        const { isInactiveAccount } = this.state;
        
        const hideFooterOnMobile = [
            WALLET_LOGIN_URL,
            WALLET_SEND_MONEY_URL,
            WALLET_SIGN_URL
        ].includes(pathname.replace(/\//g,''));

        const accountFound = this.props.account.localStorage?.accountFound;


        reportUiActiveMixpanelThrottled();

        return (
            <Container
                className={classNames([
                    'App',
                    {'network-banner': (!IS_MAINNET || SHOW_PRERELEASE_WARNING)},
                    {'hide-footer-mobile' : hideFooterOnMobile}
                ])}
                id='app-container'
            >
                <GlobalStyle />
                <ConnectedRouter basename={PATH_PREFIX} history={this.props.history}>
                    <ThemeProvider theme={theme}>
                        <ScrollToTop/>
                        <NetworkBanner
                            account={account}
                        />
                        <Navigation isInactiveAccount={isInactiveAccount}/>
                        <GlobalAlert/>
                        <LedgerConfirmActionModal/>
                        {
                            account.requestPending !== null &&
                            <TwoFactorVerifyModal
                                onClose={(verified, error) => {
                                    const { account, promptTwoFactor } = this.props;
                                    Mixpanel.track("2FA Modal Verify start");
                                    // requestPending will resolve (verified == true) or reject the Promise being awaited in the method that dispatched promptTwoFactor
                                    account.requestPending(verified, error);
                                    // clears requestPending and closes the modal
                                    promptTwoFactor(null);
                                    if (error) {
                                        // tracking error
                                        Mixpanel.track("2FA Modal Verify fail", {error: error.message});
                                    }
                                    if (verified) {
                                        Mixpanel.track("2FA Modal Verify finish");
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
                                render={(props) => isInactiveAccount ? <ActivateAccountWithRouter {...props}/> : <Wallet tab={tab} setTab={setTab} {...props} />}
                                accountFound={accountFound}
                                indexBySearchEngines={!accountFound}
                            />
                            <PublicRoute
                                exact
                                path='/linkdrop/:fundingContract/:fundingKey'
                                component={LinkdropLandingWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/create/:fundingContract?/:fundingKey?'
                                component={CreateAccountWithRouter}
                            />
                            <PublicRoute
                                exact
                                path={'/create-from/:fundingAccountId'}
                                component={CreateAccountWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/set-recovery/:accountId/:fundingContract?/:fundingKey?'
                                component={SetupRecoveryMethodWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/setup-seed-phrase/:accountId/:step'
                                component={SetupSeedPhraseWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/verify-account'
                                component={VerifyAccountWrapper}
                            />
                            <PublicRoute
                                exact
                                path='/initial-deposit'
                                component={InitialDepositWrapper}
                            />
                            <PublicRoute
                                exact
                                path='/fund-with-existing-account'
                                component={ExistingAccountWrapper}
                            />
                            <PublicRoute
                                exact
                                path='/fund-create-account/:accountId/:implicitAccountId/:recoveryMethod'
                                component={SetupImplicitWithRouter}
                            />
                            <PublicRoute
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
                            <PublicRoute
                                path='/recover-account'
                                component={RecoverAccountWrapper}
                                indexBySearchEngines={true}
                            />
                            <PublicRoute
                                exact
                                path='/recover-seed-phrase/:accountId?/:seedPhrase?'
                                component={RecoverAccountSeedPhraseWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/recover-with-link/:accountId/:seedPhrase'
                                component={RecoverWithLinkWithRouter}
                            />
                            <PublicRoute
                                exact
                                path='/auto-import-seed-phrase'
                                render={({ location }) => {
                                    const importString = decodeURIComponent(location.hash.substring(1));
                                    const hasAccountId = importString.includes('/');
                                    const seedPhrase = hasAccountId ? importString.split('/')[1] : importString;
                                    const { secretKey } = parseSeedPhrase(seedPhrase);
                                    return (
                                        <AutoImportWrapper
                                            secretKey={secretKey}
                                            accountId={hasAccountId ? importString.split('/')[0] : null}
                                            mixpanelImportType='seed phrase'
                                        />
                                    );
                                }}
                            />
                            <PublicRoute
                                exact
                                path='/auto-import-secret-key'
                                render={({ location }) => {
                                    const importString = decodeURIComponent(location.hash.substring(1));
                                    const hasAccountId = importString.includes('/');
                                    return (
                                        <AutoImportWrapper
                                            secretKey={hasAccountId ? importString.split('/')[1] : importString}
                                            accountId={hasAccountId ? importString.split('/')[0] : null}
                                            mixpanelImportType='secret key'
                                        />
                                    );
                                }}
                            />
                            <PublicRoute
                                exact
                                path='/sign-in-ledger'
                                component={SignInLedger}
                            />
                            <PrivateRoute
                                path='/login'
                                component={LoginWrapper}
                            />
                            <PrivateRoute
                                exact
                                path='/authorized-apps'
                                render={() => <AccessKeysWrapper type='authorized-apps'/>}
                            />
                            <PrivateRoute
                                exact
                                path='/full-access-keys'
                                render={() => <AccessKeysWrapper type='full-access-keys'/>}
                            />
                            {!isInactiveAccount &&
                                <PrivateRoute
                                    exact
                                    path='/send-money/:accountId?'
                                    component={SendContainerWrapper}
                                />
                            }
                            <PrivateRoute
                                exact
                                path='/receive-money'
                                component={ReceiveContainerWrapper}
                            />
                            <PrivateRoute
                                exact
                                path='/buy'
                                component={BuyNear}
                            />
                            <PublicRoute
                                exact
                                path='/profile/:accountId'
                                component={Profile}
                            />
                            {!isInactiveAccount &&
                                <PrivateRoute
                                    exact
                                    path='/profile/:accountId?'
                                    component={Profile}
                                />
                            }
                            <PrivateRoute
                                exact
                                path='/sign'
                                component={SignWithRouter}
                            />
                            {!isInactiveAccount &&
                                <PrivateRoute
                                    path='/staking'
                                    render={() => (
                                        <StakingContainer
                                            history={this.props.history}
                                        />
                                    )}
                                />
                            }
                            <PublicRoute
                                exact
                                path='/cli-login-success'
                                component={LoginCliLoginSuccess}
                            />
                            <PublicRoute
                                exact
                                path='/terms'
                                component={Terms}
                                indexBySearchEngines={true}
                            />
                            <PrivateRoute
                                component={isInactiveAccount ? ActivateAccountWithRouter : PageNotFound}
                            />
                        </Switch>
                        <Footer/>
                    </ThemeProvider>
                </ConnectedRouter>
            </Container>
        );
    }
}

Routing.propTypes = {
    history: PropTypes.object.isRequired
};

const mapDispatchToProps = {
    refreshAccount,
    handleRefreshUrl,
    handleRedirectUrl,
    handleClearUrl,
    promptTwoFactor,
    redirectTo,
    getAccountHelperWalletState,
    fetchTokenFiatValues
};

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    router: getRouter(state)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withLocalize(Routing));