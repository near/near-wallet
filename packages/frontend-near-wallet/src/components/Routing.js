import { ConnectedRouter, getRouter } from 'connected-react-router';
import isString from 'lodash.isstring';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import favicon from '../../src/images/mynearwallet-cropped.svg';
import {
    IS_MAINNET,
    PUBLIC_URL,
    SHOW_PRERELEASE_WARNING
} from '../config';
import { isWhitelabel } from '../config/whitelabel';
import '../index.css';
import * as accountActions from '../redux/actions/account';
import { handleClearAlert } from '../redux/reducers/status';
import { selectAccountSlice } from '../redux/slices/account';
import { actions as flowLimitationActions } from '../redux/slices/flowLimitation';
import { actions as tokenFiatValueActions } from '../redux/slices/tokenFiatValues';
import translations_en from '../translations/en.global.json';
import translations_it from '../translations/it.global.json';
import translations_pt from '../translations/pt.global.json';
import translations_ru from '../translations/ru.global.json';
import translations_tr from '../translations/tr.global.json';
import translations_ua from '../translations/ua.global.json';
import translations_vi from '../translations/vi.global.json';
import translations_zh_hans from '../translations/zh-hans.global.json';
import translations_zh_hant from '../translations/zh-hant.global.json';
import classNames from '../utils/classNames';
import getBrowserLocale from '../utils/getBrowserLocale';
import { getMyNearWalletUrl } from '../utils/getWalletURL';
import { reportUiActiveMixpanelThrottled } from '../utils/reportUiActiveMixpanelThrottled';
import {
    WALLET_CREATE_NEW_ACCOUNT_FLOW_URLS,
    WALLET_LOGIN_URL, WALLET_SEND_MONEY_URL, WALLET_SIGN_URL
} from '../utils/wallet';
import PrivateRoute from './common/routing/PrivateRoute';
import Route from './common/routing/Route';
import GlobalStyle from './GlobalStyle';
import NavigationWrapper from './navigation/NavigationWrapper';
import { PageNotFound } from './page-not-found/PageNotFound';
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
            .alert-banner,
            .lockup-avail-transfer {
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

class Routing extends React.Component {
    constructor(props) {
        super(props);

        this.pollTokenFiatValue = null;

        const languages = [
            { name: 'English', code: 'en' },
            { name: 'Italiano', code: 'it' },
            { name: 'Português', code: 'pt' },
            { name: 'Русский', code: 'ru' },
            { name: 'Tiếng Việt', code: 'vi' },
            { name: '简体中文', code: 'zh-hans' },
            { name: '繁體中文', code: 'zh-hant' },
            { name: 'Türkçe', code: 'tr' },
            { name: 'Українська', code: 'ua' },
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
                onMissingTranslation: ({
                    translationId,
                    defaultTranslation,
                }) => {
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
        this.props.addTranslationForLanguage(translations_it, 'it');
        this.props.addTranslationForLanguage(translations_pt, 'pt');
        this.props.addTranslationForLanguage(translations_ru, 'ru');
        this.props.addTranslationForLanguage(translations_vi, 'vi');
        this.props.addTranslationForLanguage(translations_zh_hans, 'zh-hans');
        this.props.addTranslationForLanguage(translations_zh_hant, 'zh-hant');
        this.props.addTranslationForLanguage(translations_tr, 'tr');
        this.props.addTranslationForLanguage(translations_ua, 'ua');

        this.props.setActiveLanguage(activeLang);
        // this.addTranslationsForActiveLanguage(defaultLanguage)
    }

    componentDidMount = async () => {
        if (isWhitelabel() && document) {
            document.title = 'MyNearWallet';
            document.querySelector('link[rel~="icon"]').href = favicon;
        }

        const {
            refreshAccount,
            handleRefreshUrl,
            history,
            handleRedirectUrl,
            handleClearUrl,
            router,
            fetchTokenFiatValues,
            handleClearAlert,
            handleFlowLimitation,
        } = this.props;

        fetchTokenFiatValues();
        this.startPollingTokenFiatValue();
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
        const { activeLanguage, account } = this.props;

        if (
            prevProps.account.accountId !== account.accountId &&
            account.accountId !== undefined
        ) {
            this.props.getTokenWhiteList(account.accountId);
        }

        const prevLangCode =
            prevProps.activeLanguage && prevProps.activeLanguage.code;
        const curLangCode = activeLanguage && activeLanguage.code;
        const hasLanguageChanged = prevLangCode !== curLangCode;

        if (hasLanguageChanged) {
            // this.addTranslationsForActiveLanguage(curLangCode)
            localStorage.setItem('languageCode', curLangCode);
        }
    }

    componentWillUnmount = () => {
        this.stopPollingTokenFiatValue();
    };

    startPollingTokenFiatValue = () => {
        const { fetchTokenFiatValues } = this.props;

        const handlePollTokenFiatValue = async () => {
            await fetchTokenFiatValues().catch(() => {});
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

    render() {
        const {
            pathname,
        } = this.props.router.location;

        const hideFooterOnMobile = [
            WALLET_LOGIN_URL,
            WALLET_SEND_MONEY_URL,
            WALLET_SIGN_URL,
        ].includes(pathname.replace(/\//g, ''));

        const destinationBaseURL = getMyNearWalletUrl();

        reportUiActiveMixpanelThrottled();

        return (
            <Container
                className={classNames([
                    'App',
                    {
                        'network-banner':
                            !IS_MAINNET || SHOW_PRERELEASE_WARNING,
                    },
                    { 'hide-footer-mobile': hideFooterOnMobile },
                ])}
                id="app-container"
            >
                <GlobalStyle />
                <ConnectedRouter
                    basename={PATH_PREFIX}
                    history={this.props.history}
                >
                    <ThemeProvider theme={theme}>
                        <NavigationWrapper />
                        <Switch>
                            <Redirect
                                from="/login"
                                to={`${destinationBaseURL}`}
                            />
                            <Route exact path="/" component={WalletMigration}/>
                            <PrivateRoute component={PageNotFound} />
                        </Switch>
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
