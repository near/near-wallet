import { ConnectedRouter, getRouter } from 'connected-react-router';
import isString from 'lodash.isstring';
import { parseSeedPhrase } from 'near-seed-phrase';
import PropTypes from 'prop-types';
import { stringify } from 'query-string';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { SHOW_MIGRATION_BANNER, WEB3AUTH } from '../../../../features';
import favicon from '../../src/images/favicon-32x32.png';
import TwoFactorVerifyModal from '../components/accounts/two_factor/TwoFactorVerifyModal';
import { PUBLIC_URL } from '../config';
import { isWhitelabel } from '../config/whitelabel';
import { Mixpanel } from '../mixpanel/index';
import * as accountActions from '../redux/actions/account';
import { handleClearAlert } from '../redux/reducers/status';
import { selectAccountSlice } from '../redux/slices/account';
import { actions as flowLimitationActions } from '../redux/slices/flowLimitation';
import { actions as tokenFiatValueActions } from '../redux/slices/tokenFiatValues';
import { CreateImplicitAccountWrapper } from '../routes/CreateImplicitAccountWrapper';
import { ImportAccountWithLinkWrapper } from '../routes/ImportAccountWithLinkWrapper';
import { LoginWrapper } from '../routes/LoginWrapper';
import { SetupLedgerNewAccountWrapper } from '../routes/SetupLedgerNewAccountWrapper';
import { SetupPassphraseNewAccountWrapper } from '../routes/SetupPassphraseNewAccountWrapper';
import { SetupRecoveryImplicitAccountWrapper } from '../routes/SetupRecoveryImplicitAccountWrapper';
import { SignWrapper } from '../routes/SignWrapper';
import { VerifyOwnerWrapper } from '../routes/VerifyOwnerWrapper';
import { WalletWrapper } from '../routes/WalletWrapper';
import translations_en from '../translations/en.global.json';
import classNames from '../utils/classNames';
import getBrowserLocale from '../utils/getBrowserLocale';
import { reportUiActiveMixpanelThrottled } from '../utils/reportUiActiveMixpanelThrottled';
import ScrollToTop from '../utils/ScrollToTop';
import { COLORS } from '../utils/theme';
import {
    WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS,
    WALLET_LOGIN_URL,
    WALLET_SIGN_URL,
    WALLET_SEND_MONEY_URL,
} from '../utils/wallet';
import AccessKeysWrapper from './access-keys/v2/AccessKeysWrapper';
import { AutoImportWrapper } from './accounts/auto_import/AutoImportWrapper';
import BatchImportAccounts from './accounts/batch_import_accounts';
import BatchLedgerExport from './accounts/batch_ledger_export';
import { ExistingAccountWrapper } from './accounts/create/existing_account/ExistingAccountWrapper';
import { InitialDepositWrapper } from './accounts/create/initial_deposit/InitialDepositWrapper';
import { VerifyAccountWrapper } from './accounts/create/verify_account/VerifyAccountWrapper';
import { CreateAccountWithRouter } from './accounts/CreateAccount';
import LedgerConfirmActionModal from './accounts/ledger/LedgerConfirmActionModal';
import LedgerConnectModal from './accounts/ledger/LedgerConnectModal/LedgerConnectModalWrapper';
import { SetupLedgerWithRouter } from './accounts/ledger/SetupLedger';
import { SetupLedgerSuccessWithRouter } from './accounts/ledger/SetupLedgerSuccess';
import { SignInLedgerWrapper } from './accounts/ledger/SignInLedgerWrapper';
import { LinkdropLandingWithRouter } from './accounts/LinkdropLanding';
import { RecoverAccountSeedPhraseWithRouter } from './accounts/RecoverAccountSeedPhrase';
import { RecoverAccountWrapper } from './accounts/RecoverAccountWrapper';
import { SetupRecoveryMethodWithRouter } from './accounts/recovery_setup/SetupRecoveryMethod';
import { SetupImplicitWithRouter } from './accounts/SetupImplicit';
import { SetupSeedPhraseWithRouter } from './accounts/SetupSeedPhrase';
import { EnableTwoFactor } from './accounts/two_factor/EnableTwoFactor';
import { BuyNear } from './buy/BuyNear';
import Footer from './common/Footer';
import GlobalAlert from './common/GlobalAlert';
import GuestLandingRoute from './common/GuestLandingRoute';
import MigrationBanner from './common/MigrationBanner';
import PrivateRoute from './common/routing/PrivateRoute';
import PublicRoute from './common/routing/PublicRoute';
import Route from './common/routing/Route';
import { Dao } from './Dao';
import GlobalStyle from './GlobalStyle';
import { LoginCliLoginSuccess } from './login/LoginCliLoginSuccess';
import NavigationWrapper from './navigation/NavigationWrapper';
import { NFTDetailWrapper } from './nft/NFTDetailWrapper';
import { PageNotFound } from './page-not-found/PageNotFound';
import Privacy from './privacy/Privacy';
import { Profile } from './profile/Profile';
import { ReceiveContainerWrapper } from './receive-money/ReceiveContainerWrapper';
import { SendContainerWrapper } from './send/SendContainerWrapper';
import { StakingContainer } from './staking/StakingContainer';
import Swap from './swap/Swap';
import Terms from './terms/Terms';
import '../index.css';
import WalletMigration from './wallet-migration/WalletMigration';
const { fetchTokenFiatValues, getTokenWhiteList } = tokenFiatValueActions;

const {
    handleClearUrl,
    handleRedirectUrl,
    handleRefreshUrl,
    promptTwoFactor,
    redirectTo,
    refreshAccount,
} = accountActions;

const { handleFlowLimitation } = flowLimitationActions;

const theme = {};

const PATH_PREFIX = PUBLIC_URL;

const Container = styled.div`
    min-height: 100vh;
    padding-bottom: 150px;
    padding-top: 160px;
    background-color: ${COLORS.black};

    @media (max-width: 991px) {
        .App {
            .main {
                padding-bottom: 0;
            }
        }
    }
    &.network-banner {
        @media (max-width: 450px) {
            .alert-banner,
            .lockup-avail-transfer {
                margin-top: -45px;
            }
        }
    }

    @media (max-width: 767px) {
        padding-bottom: 218px;
        padding-top: 102px;
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

        this.pollTokenFiatValue = null;

        const languages = [
            { name: 'English', code: 'en' },
        ];

        const browserLanguage = getBrowserLocale(languages.map((l) => l.code));
        const activeLang =
            localStorage.getItem('languageCode') ||
            browserLanguage ||
            languages[0].code;

        this.props.initialize({
            languages,
            options: {
                defaultLanguage: 'en',
                onMissingTranslation: ({ defaultTranslation }) => {
                    if (isString(defaultTranslation)) {
                        // do anything to change the defaultTranslation as you wish
                        return defaultTranslation;
                    } else {
                        // that's the code that can fix the issue
                        return ReactDOMServer.renderToStaticMarkup(
                            defaultTranslation
                        );
                    }
                },
                renderToStaticMarkup: ReactDOMServer.renderToStaticMarkup,
                renderInnerHtml: true,
            },
        });

        // TODO: Figure out how to load only necessary translations dynamically
        this.props.addTranslationForLanguage(translations_en, 'en');

        this.props.setActiveLanguage(activeLang);

        this.state = {
            openTransferPopup: false,
        };
    }

    componentDidMount = async () => {
        if (isWhitelabel() && document) {
            document.title = 'NextWallet';
            document.querySelector('link[rel~="icon"]').href = favicon;
        }

        const {
            refreshAccount,
            handleRefreshUrl,
            history,
            handleRedirectUrl,
            handleClearUrl,
            router,
            handleClearAlert,
            handleFlowLimitation,
        } = this.props;

        handleRefreshUrl(router);
        refreshAccount();

        history.listen(async () => {
            handleRedirectUrl(this.props.router.location);
            handleClearUrl();
            if (
                !WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS.find(
                    (path) =>
                        this.props.router.location.pathname.indexOf(path) > -1
                )
            ) {
                await refreshAccount(true);
            }

            handleClearAlert();
            handleFlowLimitation();
        });
    };

    componentDidUpdate(prevProps) {
        const { activeLanguage, fetchTokenFiatValues, account } = this.props;

        if (
            prevProps.account.accountId !== account.accountId &&
            account.accountId !== undefined
        ) {
            this.props.getTokenWhiteList(account.accountId);
            fetchTokenFiatValues({ accountId: account.accountId });
            this.startPollingTokenFiatValue();
        }

        const prevLangCode =
            prevProps.activeLanguage && prevProps.activeLanguage.code;
        const curLangCode = activeLanguage && activeLanguage.code;
        const hasLanguageChanged = prevLangCode !== curLangCode;

        if (hasLanguageChanged) {
            localStorage.setItem('languageCode', curLangCode);
        }
    }

    componentWillUnmount = () => {
        this.stopPollingTokenFiatValue();
    };

    startPollingTokenFiatValue = () => {
        const { fetchTokenFiatValues, account } = this.props;

        const handlePollTokenFiatValue = async () => {
            await fetchTokenFiatValues({ accountId: account.accountId }).catch(() => {});
            if (this.pollTokenFiatValue) {
                this.pollTokenFiatValue = setTimeout(
                    () => handlePollTokenFiatValue(),
                    30000
                );
            }
        };
        this.pollTokenFiatValue = setTimeout(
            () => handlePollTokenFiatValue(),
            30000
        );
    };

    stopPollingTokenFiatValue = () => {
        clearTimeout(this.pollTokenFiatValue);
        this.pollTokenFiatValue = null;
    };

    handleTransferClick = () => {

        this.setState({ openTransferPopup: true });
    }

    closeTransferPopup = () => {
        this.setState({ openTransferPopup: false });
    }

    render() {
        const {
            search,
            query: { tab },
            hash,
            pathname,
        } = this.props.router.location;
        const { account } = this.props;
        const setTab = (nextTab) => {
            if (tab !== nextTab) {
                // Ensure any `hash` value remains in the URL when we toggle tab
                this.props.history.push({
                    search: stringify(
                        { tab: nextTab },
                        { skipNull: true, skipEmptyString: true }
                    ),
                    hash,
                });
            }
        };

        const hideFooterOnMobile = [
            WALLET_LOGIN_URL,
            WALLET_SEND_MONEY_URL,
            WALLET_SIGN_URL,
        ].includes(pathname.replace(/\//g, ''));

        const accountFound = this.props.account.localStorage?.accountFound;

        reportUiActiveMixpanelThrottled();

        const containerClass = classNames([
            'App',
            { 'hide-footer-mobile': hideFooterOnMobile },
        ]);

        return (
            <Container
                className={containerClass}
                id="app-container"
            >
                <GlobalStyle />
                <ConnectedRouter
                    basename={PATH_PREFIX}
                    history={this.props.history}
                >
                    <ThemeProvider theme={theme}>
                        <ScrollToTop />
                        {SHOW_MIGRATION_BANNER && (
                            <MigrationBanner
                                account={account}
                                onTransfer={this.handleTransferClick}
                            />
                        )}
                        <NavigationWrapper />
                        <GlobalAlert />
                        <WalletMigration
                            open={this.state.openTransferPopup}
                            history={this.props.history}
                            onClose={this.closeTransferPopup} />
                        <LedgerConfirmActionModal />
                        <LedgerConnectModal />
                        {account.requestPending !== null && (
                            <TwoFactorVerifyModal
                                onClose={(verified, error) => {
                                    const { account, promptTwoFactor } =
                                        this.props;
                                    Mixpanel.track('2FA Modal Verify start');
                                    // requestPending will resolve (verified == true) or reject the Promise being awaited in the method that dispatched promptTwoFactor
                                    account.requestPending(verified, error);
                                    // clears requestPending and closes the modal
                                    promptTwoFactor(null);
                                    if (error) {
                                        // tracking error
                                        Mixpanel.track(
                                            '2FA Modal Verify fail',
                                            { error: error.message }
                                        );
                                    }
                                    if (verified) {
                                        Mixpanel.track(
                                            '2FA Modal Verify finish'
                                        );
                                    }
                                }}
                            />
                        )}
                        <Switch>
                            <Redirect
                                from="//*"
                                to={{
                                    pathname: '/*',
                                    search: search,
                                }}
                            />
                            <GuestLandingRoute
                                exact
                                path="/"
                                render={(props) => (
                                    <WalletWrapper
                                        tab={tab}
                                        setTab={setTab}
                                        {...props}
                                    />
                                )}
                                accountFound={accountFound}
                                indexBySearchEngines={!accountFound}
                            />
                            <Route
                                exact
                                path="/linkdrop/:fundingContract/:fundingKey"
                                component={LinkdropLandingWithRouter}
                            />
                            <Route
                                exact
                                path="/create/:fundingContract/:fundingKey"
                                component={CreateAccountWithRouter}
                            />
                            <Route
                                exact
                                path="/create"
                                render={(props) => <CreateAccountWithRouter {...props} />}
                                // Logged in users always create a named account
                            />
                            <Route
                                exact
                                path="/create"
                                component={CreateAccountWithRouter}
                            />
                            <Route
                                exact
                                path={'/create-from/:fundingAccountId'}
                                component={CreateAccountWithRouter}
                            />
                            <Route
                                exact
                                path="/set-recovery/:accountId/:fundingContract?/:fundingKey?"
                                component={SetupRecoveryMethodWithRouter}
                            />
                            <PublicRoute
                                exact
                                path="/set-recovery-implicit-account"
                                component={
                                    SetupRecoveryImplicitAccountWrapper
                                }
                            />
                            <PublicRoute
                                exact
                                path="/setup-passphrase-new-account"
                                component={SetupPassphraseNewAccountWrapper}
                            />
                            <PublicRoute
                                exact
                                path="/setup-ledger-new-account"
                                component={SetupLedgerNewAccountWrapper}
                            />
                            <PublicRoute
                                exact
                                path="/create-implicit-account"
                                component={CreateImplicitAccountWrapper}
                            />
                            <Route
                                exact
                                path="/setup-seed-phrase/:accountId/:step"
                                component={SetupSeedPhraseWithRouter}
                            />
                            <Route
                                exact
                                path="/verify-account"
                                component={VerifyAccountWrapper}
                            />
                            <Route
                                exact
                                path="/initial-deposit"
                                component={InitialDepositWrapper}
                            />
                            <Route
                                exact
                                path="/fund-with-existing-account"
                                component={ExistingAccountWrapper}
                            />
                            <Route
                                exact
                                path="/fund-create-account/:accountId/:implicitAccountId/:recoveryMethod"
                                component={SetupImplicitWithRouter}
                            />
                            <Route
                                exact
                                path="/setup-ledger/:accountId"
                                component={SetupLedgerWithRouter}
                            />
                            <PrivateRoute
                                exact
                                path="/setup-ledger-success"
                                component={SetupLedgerSuccessWithRouter}
                            />
                            <PrivateRoute
                                exact
                                path="/enable-two-factor"
                                component={EnableTwoFactor}
                            />
                            <Route
                                path="/recover-account"
                                component={RecoverAccountWrapper}
                                indexBySearchEngines={true}
                            />
                            <Route
                                exact
                                path="/recover-seed-phrase/:accountId?/:seedPhrase?"
                                component={RecoverAccountSeedPhraseWithRouter}
                            />
                            <Route
                                exact
                                path="/recover-with-link/:accountId/:seedPhrase"
                                component={ImportAccountWithLinkWrapper}
                            />
                            <Route
                                exact
                                path="/auto-import-seed-phrase"
                                render={({ location }) => {
                                    const importString = decodeURIComponent(
                                        location.hash.substring(1)
                                    );
                                    const hasAccountId =
                                        importString.includes('/');
                                    const seedPhrase = hasAccountId
                                        ? importString.split('/')[1]
                                        : importString;
                                    const { secretKey } =
                                        parseSeedPhrase(seedPhrase);
                                    return (
                                        <AutoImportWrapper
                                            secretKey={secretKey}
                                            accountId={
                                                hasAccountId
                                                    ? importString.split('/')[0]
                                                    : null
                                            }
                                            mixpanelImportType="seed phrase"
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact
                                path="/auto-import-secret-key"
                                render={({ location }) => {
                                    const importString = decodeURIComponent(
                                        location.hash.substring(1)
                                    );
                                    const hasAccountId =
                                        importString.includes('/');
                                    return (
                                        <AutoImportWrapper
                                            secretKey={
                                                hasAccountId
                                                    ? importString.split('/')[1]
                                                    : importString
                                            }
                                            accountId={
                                                hasAccountId
                                                    ? importString.split('/')[0]
                                                    : null
                                            }
                                            mixpanelImportType="secret key"
                                        />
                                    );
                                }}
                            />
                            <Route exact path="/batch-import" render={() =>
                                (<BatchImportAccounts
                                    onCancel={() => this.props.history.replace('/')} />)}
                            />
                            <Route
                                exact
                                path="/batch-ledger-export"
                                component={BatchLedgerExport}
                            />
                            <Route
                                exact
                                path="/sign-in-ledger"
                                component={SignInLedgerWrapper}
                            />
                            <PrivateRoute
                                path="/login"
                                component={LoginWrapper}
                            />
                            <PrivateRoute
                                exact
                                path="/authorized-apps"
                                render={() => (
                                    <AccessKeysWrapper type="authorized-apps" />
                                )}
                            />
                            <PrivateRoute
                                exact
                                path="/full-access-keys"
                                render={() => (
                                    <AccessKeysWrapper type="full-access-keys" />
                                )}
                            />
                            <PrivateRoute
                                exact
                                path="/send-money/:accountId?"
                                component={SendContainerWrapper}
                            />
                            <PrivateRoute
                                exact
                                path="/nft-detail/:contractId/:tokenId"
                                component={NFTDetailWrapper}
                            />
                            <PrivateRoute
                                exact
                                path="/receive-money"
                                component={ReceiveContainerWrapper}
                            />
                            <PrivateRoute
                                exact
                                path="/buy"
                                component={BuyNear}
                            />
                            <PrivateRoute
                                exact
                                path="/swap"
                                component={Swap}
                            />
                            <Route
                                exact
                                path="/profile/:accountId"
                                component={Profile}
                            />
                            <PrivateRoute
                                exact
                                path="/profile/:accountId?"
                                component={Profile}
                            />
                            <PrivateRoute
                                exact
                                path="/dao"
                                component={Dao}
                            />
                            <PrivateRoute
                                exact
                                path="/sign"
                                component={SignWrapper}
                            />
                            <PrivateRoute
                                path="/staking"
                                render={() => (
                                    <StakingContainer
                                        history={this.props.history}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/cli-login-success"
                                component={LoginCliLoginSuccess}
                            />
                            <Route
                                exact
                                path="/terms"
                                component={Terms}
                                indexBySearchEngines={true}
                            />
                            <Route
                                exact
                                path="/privacy"
                                component={Privacy}
                                indexBySearchEngines={true}
                            />
                            {WEB3AUTH && (
                                <PrivateRoute
                                    exact
                                    path="/verify-owner"
                                    component={VerifyOwnerWrapper}
                                />
                            )}
                            <PrivateRoute component={PageNotFound} />
                        </Switch>
                        <Footer />
                    </ThemeProvider>
                </ConnectedRouter>
            </Container>
        );
    }
}

Routing.propTypes = {
    history: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
    refreshAccount,
    handleRefreshUrl,
    handleRedirectUrl,
    handleClearUrl,
    promptTwoFactor,
    redirectTo,
    fetchTokenFiatValues,
    handleClearAlert,
    handleFlowLimitation,
    getTokenWhiteList,
};

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    router: getRouter(state),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withLocalize(Routing));
