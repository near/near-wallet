import { getRouter } from 'connected-react-router';
import { parse as parseQuery, stringify } from 'query-string';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { Mixpanel } from '../../mixpanel/index';
import {
    recoverAccountSeedPhrase,
    redirectToApp,
    redirectTo,
    refreshAccount,
    clearAccountState
} from '../../redux/actions/account';
import { clearLocalAlert, showCustomAlert, clearGlobalAlert } from '../../redux/actions/status';
import { selectAccountSlice } from '../../redux/slices/account';
import { actions as importZeroBalanceAccountActions } from '../../redux/slices/importZeroBalanceAccount';
import { importZeroBalanceAccountPhrase } from '../../redux/slices/importZeroBalanceAccount/importAccountThunks';
import { selectActionsPending, selectStatusLocalAlert, selectStatusMainLoader } from '../../redux/slices/status';
import isValidSeedPhrase from '../../utils/isValidSeedPhrase';
import parseFundingOptions from '../../utils/parseFundingOptions';
import Container from '../common/styled/Container.css';
import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm';

const { setZeroBalanceAccountImportMethod } = importZeroBalanceAccountActions;

const StyledContainer = styled(Container)`
    .input {
        width: 100%;
    }

    .input-sub-label {
        margin-bottom: 30px;
    }

    h4 {
        :first-of-type {
            margin: 30px 0 0 0 !important;
        }
    }

    button {
        width: 100% !important;
        margin-top: 30px !important;
    }
`;

class RecoverAccountSeedPhrase extends Component {
    state = {
        seedPhrase: this.props.seedPhrase,
        recoveringAccount: false,
        showCouldNotFindAccountModal: false
    }

    // TODO: Use some validation framework?
    validators = {
        seedPhrase: (value) => !!value.length
    }

    get isLegit() {
        return Object.keys(this.validators).every((field) => this.validators[field](this.state[field]));
    }

    handleChange = (value) => {
        this.setState(() => ({
            seedPhrase: value
        }));

        this.props.clearLocalAlert();
    }

    handleSubmit = async () => {
        if (!this.isLegit) {
            Mixpanel.track('IE-SP Recover seed phrase link not valid');
            return false;
        }

        const { seedPhrase } = this.state;
        const {
            location,
            redirectTo,
            redirectToApp,
            clearAccountState,
            recoverAccountSeedPhrase,
            refreshAccount,
            showCustomAlert,
            importZeroBalanceAccountPhrase,
            setZeroBalanceAccountImportMethod
        } = this.props;

        try {
            isValidSeedPhrase(seedPhrase);
        } catch (e) {
            showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.recoverAccountSeedPhrase.errorSeedPhraseNotValid',
                errorMessage: e.message
            });
            return;
        }

        await Mixpanel.withTracking('IE-SP Recovery with seed phrase',
            async () => {
                this.setState({ recoveringAccount: true });
                await recoverAccountSeedPhrase(seedPhrase);
                await refreshAccount();
            }, async (e) => {
                if (e.message.includes('Cannot find matching public key')) {
                    await importZeroBalanceAccountPhrase(seedPhrase);
                    setZeroBalanceAccountImportMethod('phrase');
                    clearGlobalAlert();
                    redirectToApp();
                }

                throw e;
            }, () => {
                this.setState({ recoveringAccount: false });
            }
        );

        const fundWithExistingAccount = parseQuery(location.search, { parseBooleans: true }).fundWithExistingAccount;
        if (fundWithExistingAccount) {
            const createNewAccountParams = stringify(JSON.parse(fundWithExistingAccount));
            redirectTo(`/fund-with-existing-account?${createNewAccountParams}`);
        } else {
            const options = parseFundingOptions(location.search);
            if (options) {
                const query = parseQuery(location.search);
                const redirectUrl = query.redirectUrl ? `?redirectUrl=${encodeURIComponent(query.redirectUrl)}` : '';
                redirectTo(`/linkdrop/${options.fundingContract}/${options.fundingKey}${redirectUrl}`);
            } else {
                redirectToApp('/');
            }
        }
        clearAccountState();
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.isLegit && !(this.props.localAlert && this.props.localAlert.success === false)
        };

        return (
            <StyledContainer className='small-centered border'>
                <h1><Translate id='recoverSeedPhrase.pageTitle' /></h1>
                <h2><Translate id='recoverSeedPhrase.pageText' /></h2>
                <form onSubmit={(e) => { this.handleSubmit(); e.preventDefault(); }} autoComplete='off'>
                    <RecoverAccountSeedPhraseForm
                        {...combinedState}
                        handleChange={this.handleChange}
                    />
                </form>
            </StyledContainer>
        );
    }
}

const mapDispatchToProps = {
    recoverAccountSeedPhrase,
    redirectTo,
    redirectToApp,
    refreshAccount,
    clearLocalAlert,
    clearAccountState,
    showCustomAlert,
    importZeroBalanceAccountPhrase,
    setZeroBalanceAccountImportMethod
};

const mapStateToProps = (state, { match }) => ({
    ...selectAccountSlice(state),
    router: getRouter(state),
    seedPhrase: match.params.seedPhrase || '',
    localAlert: selectStatusLocalAlert(state),
    mainLoader: selectStatusMainLoader(state),
    findMyAccountSending: selectActionsPending(state, { types: ['RECOVER_ACCOUNT_SEED_PHRASE', 'REFRESH_ACCOUNT_OWNER'] })
});

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase));
