import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { recoverAccountSeedPhrase, redirectToApp, redirectTo, refreshAccount } from '../../actions/account';
import { staking } from '../../actions/staking';
import { clearLocalAlert } from '../../actions/status';
import { Mixpanel } from '../../mixpanel/index';
import parseFundingOptions from '../../utils/parseFundingOptions';
import Container from '../common/styled/Container.css';
import RecoverAccountSeedPhraseForm from './RecoverAccountSeedPhraseForm';

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
    }

    // TODO: Use some validation framework?
    validators = {
        seedPhrase: value => !!value.length // TODO validate seed phrase
    }

    get isLegit() {
        return Object.keys(this.validators).every(field => this.validators[field](this.state[field]));
    }

    componentDidMount = () => {}

    handleChange = (value) => {
        this.setState(() => ({
            seedPhrase: value
        }));

        this.props.clearLocalAlert();
    }

    handleSubmit = async () => {
        if (!this.isLegit) {
            Mixpanel.track("IE-SP Recover seed phrase link not valid");
            return false;
        }
        const { seedPhrase } = this.state;

        await Mixpanel.withTracking("IE-SP Recovery with seed phrase",
            async () => {
                await this.props.recoverAccountSeedPhrase(seedPhrase);
                await this.props.refreshAccount();
            }
        );
        const options = parseFundingOptions(this.props.location.search);
        if (options) {
            this.props.redirectTo(`/linkdrop/${options.fundingContract}/${options.fundingKey}`);
        } else {
            this.props.redirectToApp('/');
        }
        this.props.clearState();
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
                <form onSubmit={e => {this.handleSubmit(); e.preventDefault();}} autoComplete='off'>
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
    clearState: staking.clearState
};

const mapStateToProps = ({ account, status, router }, { match }) => ({
    ...account,
    router,
    seedPhrase: match.params.seedPhrase || '',
    localAlert: status.localAlert,
    mainLoader: status.mainLoader
});

export const RecoverAccountSeedPhraseWithRouter = connect(
    mapStateToProps, 
    mapDispatchToProps
)(withRouter(RecoverAccountSeedPhrase));
