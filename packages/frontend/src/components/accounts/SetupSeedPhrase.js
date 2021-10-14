import { createMatchSelector } from 'connected-react-router';
import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';

import { Mixpanel } from '../../mixpanel/index';
import {
    handleAddAccessKeySeedPhrase,
    refreshAccount,
    checkIsNew,
    handleCreateAccountWithSeedPhrase,
    fundCreateAccount
} from '../../redux/actions/account';
import { clearGlobalAlert, showCustomAlert } from '../../redux/actions/status';
import { selectAccountSlice } from '../../redux/slices/account';
import { actions as linkdropActions } from '../../redux/slices/linkdrop';
import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId, selectRecoveryMethodsLoading } from '../../redux/slices/recoveryMethods';
import { selectStatusMainLoader } from '../../redux/slices/status';
import copyText from '../../utils/copyText';
import isMobile from '../../utils/isMobile';
import parseFundingOptions from '../../utils/parseFundingOptions';
import { wallet } from '../../utils/wallet';
import { Snackbar, snackbarDuration } from '../common/Snackbar';
import Container from '../common/styled/Container.css';
import { isRetryableRecaptchaError } from '../Recaptcha';
import SetupSeedPhraseForm from './SetupSeedPhraseForm';
import SetupSeedPhraseVerify from './SetupSeedPhraseVerify';

const { setLinkdropAmount } = linkdropActions;
const { fetchRecoveryMethods } = recoveryMethodsActions;

// FIXME: Use `debug` npm package so we can keep some debug logging around but not spam the console everywhere
const ENABLE_DEBUG_LOGGING = false;

const debugLog = (...args) => ENABLE_DEBUG_LOGGING && console.log('SetupSeedPhrase:', ...args);

class SetupSeedPhrase extends Component {
    recaptchaRef = null

    state = {
        seedPhrase: '',
        enterWord: '',
        wordId: null,
        localAlert: null,
        successSnackbar: false,
        submitting: false,
        recaptchaToken: null,
        isNewAccount: false
    }

    componentDidMount = async () => {
        const { accountId, fetchRecoveryMethods } = this.props;
        this.refreshData();

        if (accountId === wallet.accountId) {
            fetchRecoveryMethods({ accountId });
        }

        // We need to know if the account is new so when we render SetupSeedPhraseVerify, it doesn't load reCaptcha if its an existing account
        const isNewAccount = await this.props.checkIsNew(this.props.accountId);
        this.setState({ isNewAccount });
    }

    refreshData = () => {

        const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
        const recoveryKeyPair = KeyPair.fromString(secretKey);
        const wordId = Math.floor(Math.random() * 12);

        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey,
            wordId,
            enterWord: '',
            localAlert: null,
            recoveryKeyPair
        }));
    }

    handleChangeWord = (value) => {
        if (value.match(/[^a-zA-Z]/)) {
            return false;
        }

        this.setState(() => ({
            enterWord: value.trim().toLowerCase(),
            localAlert: null
        }));
    }

    handleStartOver = e => {
        const {
            history,
            location,
            accountId,
        } = this.props;

        this.refreshData();
        history.push(`/setup-seed-phrase/${accountId}/phrase${location.search}`);
    }

    handleVerifyPhrase = () => {
        const { seedPhrase, enterWord, wordId, submitting } = this.state;
        Mixpanel.track("SR-SP Verify start");
        if (enterWord !== seedPhrase.split(' ')[wordId]) {
            this.setState(() => ({
                localAlert: {
                    success: false,
                    messageCode: 'account.verifySeedPhrase.error',
                    show: true
                }
            }));
            Mixpanel.track("SR-SP Verify fail", { error: 'word is not matched the phrase' });
            return false;
        }

        if (!submitting) {
            this.setState({ submitting: true }, this.handleSetupSeedPhrase);
        }
        Mixpanel.track("SR-SP Verify finish");
    }

    handleSetupSeedPhrase = async () => {
        debugLog('handleSetupSeedPhrase()');
        const {
            accountId,
            handleAddAccessKeySeedPhrase,
            handleCreateAccountWithSeedPhrase,
            fundCreateAccount,
            showCustomAlert,
            location,
            setLinkdropAmount
        } = this.props;
        const { recoveryKeyPair, recaptchaToken } = this.state;

        if (!this.state.isNewAccount) {
            debugLog('handleSetupSeedPhrase()/existing account');

            await Mixpanel.withTracking("SR-SP Setup for existing account",
                async () => await handleAddAccessKeySeedPhrase(accountId, recoveryKeyPair)
            );
            return;
        }

        const fundingOptions = parseFundingOptions(location.search);

        await Mixpanel.withTracking("SR-SP Setup for new account",
            async () => {
                await handleCreateAccountWithSeedPhrase(accountId, recoveryKeyPair, fundingOptions, recaptchaToken);
                if (fundingOptions?.fundingAmount) {
                    setLinkdropAmount(fundingOptions.fundingAmount);
                }
            },
            async (err) => {
                debugLog('failed to create account!', err);

                this.setState({ submitting: false });
                
                if (isRetryableRecaptchaError(err)) {
                    Mixpanel.track('Funded account creation failed due to invalid / expired reCaptcha response from user');
                    this.recaptchaRef.reset();
                    showCustomAlert({
                        success: false,
                        messageCodeHeader: 'error',
                        messageCode: 'walletErrorCodes.invalidRecaptchaCode',
                        errorMessage: err.message
                    });
                } else if(err.code === 'NotEnoughBalance') {
                    Mixpanel.track('SR-SP NotEnoughBalance creating funded account');
                    await fundCreateAccount(accountId, recoveryKeyPair, 'phrase');
                } else {
                    showCustomAlert({
                        errorMessage: err.message,
                        success: false,
                        messageCodeHeader: 'error'
                    });
                }
            }
        );
    }

    handleCopyPhrase = () => {
        Mixpanel.track("SR-SP Copy seed phrase");
        if (navigator.share && isMobile()) {
            navigator.share({
                text: this.state.seedPhrase
            }).catch(err => {
                debugLog(err.message);
            });
        } else {
            this.handleCopyDesktop();
        }
    }

    handleCopyDesktop = () => {
        copyText(document.getElementById('seed-phrase'));
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({ successSnackbar: false });
            }, snackbarDuration);
        });
    }

    handleRecaptchaChange = (recaptchaToken) => {
        debugLog('handleRecaptchaChange()', recaptchaToken);
        this.setState({ recaptchaToken });
    }

    handleOnSubmit = (e) => {
        this.handleVerifyPhrase();
        e.preventDefault();
    }

    render() {
        const { recoveryMethods, recoveryMethodsLoader } = this.props;
        const hasSeedPhraseRecovery = recoveryMethodsLoader || recoveryMethods.filter(m => m.kind === 'phrase').length > 0;
        const { seedPhrase, enterWord, wordId, submitting, localAlert, isNewAccount, successSnackbar } = this.state;

        return (
            <Translate>
                {({ translate }) => (
                    <Fragment>
                        <Route
                            exact
                            path={`/setup-seed-phrase/:accountId/phrase`}
                            render={() => (
                                <Container className='small-centered border'>
                                    <h1><Translate id='setupSeedPhrase.pageTitle'/></h1>
                                    <h2><Translate id='setupSeedPhrase.pageText'/></h2>
                                    <SetupSeedPhraseForm
                                        seedPhrase={seedPhrase}
                                        handleCopyPhrase={this.handleCopyPhrase}
                                        hasSeedPhraseRecovery={hasSeedPhraseRecovery}
                                    />
                                </Container>
                            )}
                        />
                        <Route
                            exact
                            path={`/setup-seed-phrase/:accountId/verify`}
                            render={() => (
                                <Container className='small-centered border'>
                                    <form
                                        onSubmit={this.handleOnSubmit}
                                        autoComplete='off'
                                    >
                                        <h1><Translate id='setupSeedPhraseVerify.pageTitle'/></h1>
                                        <h2><Translate id='setupSeedPhraseVerify.pageText'/></h2>
                                        <SetupSeedPhraseVerify
                                            enterWord={enterWord}
                                            wordId={wordId}
                                            handleChangeWord={this.handleChangeWord}
                                            handleStartOver={this.handleStartOver}
                                            mainLoader={this.props.mainLoader || submitting}
                                            localAlert={localAlert}
                                            globalAlert={this.props.globalAlert}
                                            onRecaptchaChange={this.handleRecaptchaChange}
                                            ref={(ref) => this.recaptchaRef = ref}
                                            isNewAccount={isNewAccount}
                                            onSubmit={this.handleOnSubmit}
                                            isLinkDrop={parseFundingOptions(this.props.location.search) !== null}
                                            hasSeedPhraseRecovery={hasSeedPhraseRecovery}
                                        />
                                    </form>
                                </Container>
                            )}
                        />
                        <Snackbar
                            theme='success'
                            message={translate('setupSeedPhrase.snackbarCopySuccess')}
                            show={successSnackbar}
                            onHide={() => this.setState({ successSnackbar: false })}
                        />
                    </Fragment>
                )}
            </Translate>
        );
    }
}

const mapDispatchToProps = {
    clearGlobalAlert,
    handleAddAccessKeySeedPhrase,
    refreshAccount,
    checkIsNew,
    handleCreateAccountWithSeedPhrase,
    fundCreateAccount,
    fetchRecoveryMethods,
    showCustomAlert,
    setLinkdropAmount
};

const mapStateToProps = (state, { match }) => {
    return {
        ...selectAccountSlice(state),
        accountId: createMatchSelector('/setup-seed-phrase/:accountId/:step')(state).params.accountId,
        recoveryMethods: selectRecoveryMethodsByAccountId(state, { accountId: wallet.accountId }),
        mainLoader: selectStatusMainLoader(state),
        recoveryMethodsLoader: selectRecoveryMethodsLoading(state, { accountId: match.params.accountId })
    };
};

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase));
