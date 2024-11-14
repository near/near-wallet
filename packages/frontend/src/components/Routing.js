import { ConnectedRouter, getRouter } from 'connected-react-router';
import isString from 'lodash.isstring';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import { WEB3AUTH } from '../../../../features';
import { PUBLIC_URL } from '../config';
import { isWhitelabel } from '../config/whitelabel';
import * as accountActions from '../redux/actions/account';
import { handleClearAlert } from '../redux/reducers/status';
import { selectAccountSlice } from '../redux/slices/account';
import { actions as flowLimitationActions } from '../redux/slices/flowLimitation';
import translations_en from '../translations/en.global.json';
import translations_it from '../translations/it.global.json';
import translations_kr from '../translations/kr.global.json';
import translations_pt from '../translations/pt.global.json';
import translations_ru from '../translations/ru.global.json';
import translations_tr from '../translations/tr.global.json';
import translations_ua from '../translations/ua.global.json';
import translations_vi from '../translations/vi.global.json';
import translations_zh_hans from '../translations/zh-hans.global.json';
import translations_zh_hant from '../translations/zh-hant.global.json';
import classNames from '../utils/classNames';
import getBrowserLocale from '../utils/getBrowserLocale';
import { reportUiActiveMixpanelThrottled } from '../utils/reportUiActiveMixpanelThrottled';
import PrivateRoute from './common/routing/PrivateRoute';
import Route from './common/routing/Route';
import GlobalStyle from './GlobalStyle';
import { GuestLanding } from './landing/GuestLanding';
import { PageNotFound } from './page-not-found/PageNotFound';
import Privacy from './privacy/Privacy';
import Terms from './terms/Terms';
import { initAnalytics } from './wallet-migration/metrics';
import RecoveryRedirect from './wallet-migration/RecoveryRedirect';
import '../index.css';

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
    padding-bottom: 100px;
    padding-top: 75px;
    @media (max-width: 991px) {
        .App {
            .main {
                padding-bottom: 0px;
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
            { name: '한국어', code: 'kr' },
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
        this.props.addTranslationForLanguage(translations_it, 'it');
        this.props.addTranslationForLanguage(translations_pt, 'pt');
        this.props.addTranslationForLanguage(translations_ru, 'ru');
        this.props.addTranslationForLanguage(translations_vi, 'vi');
        this.props.addTranslationForLanguage(translations_zh_hans, 'zh-hans');
        this.props.addTranslationForLanguage(translations_zh_hant, 'zh-hant');
        this.props.addTranslationForLanguage(translations_tr, 'tr');
        this.props.addTranslationForLanguage(translations_ua, 'ua');
        this.props.addTranslationForLanguage(translations_kr, 'kr');

        this.props.setActiveLanguage(activeLang);
        // this.addTranslationsForActiveLanguage(defaultLanguage)

        this.state = {
            openTransferPopup: false,
        };
    }

    componentDidMount = async () => {
        if (isWhitelabel && document) {
            document.title = 'NEAR Ecosystem Wallets';
        }

        await initAnalytics();

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
            handleClearAlert();
            handleFlowLimitation();
        });
    };

    render() {
        const { search } = this.props.router.location;

        reportUiActiveMixpanelThrottled();

        return (
            <Container className={classNames(['App'])} id="app-container">
                <GlobalStyle />
                <ConnectedRouter
                    basename={PATH_PREFIX}
                    history={this.props.history}
                >
                    <ThemeProvider theme={theme}>
                        <Switch>
                            <Redirect
                                from="//*"
                                to={{
                                    pathname: '/*',
                                    search: search,
                                }}
                            />
                            <Route exact path="/" component={GuestLanding} />
                            <Route
                                exact
                                path="/transfer-wizard"
                                component={GuestLanding}
                            />
                            <PrivateRoute
                                exact
                                path="/disable-two-factor"
                                component={GuestLanding}
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
                                    component={GuestLanding}
                                />
                            )}
                            {/* NOTE: Please keep this route and ensure its working as expected. 
                            This redirects email & text recovery links to an external wallet (MNW) */}
                            <Route
                                exact
                                path="/recover-with-link/:accountId/:seedPhrase"
                                component={RecoveryRedirect}
                            />
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
    handleClearAlert,
    handleFlowLimitation,
};

const mapStateToProps = (state) => ({
    account: selectAccountSlice(state),
    router: getRouter(state),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withLocalize(Routing));
