import { getRouter } from 'connected-react-router';
import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styled from 'styled-components';


import { Mixpanel } from '../../../mixpanel/index';
import * as accountActions from '../../../redux/actions/account';
import { selectAccountId, selectAccountSlice } from '../../../redux/slices/account';
import { actions as recoveryMethodsActions, selectRecoveryMethodsByAccountId, selectRecoveryMethodsLoading } from '../../../redux/slices/recoveryMethods';
import { selectActionsPending, selectStatusMainLoader } from '../../../redux/slices/status';
import FormButton from '../../common/FormButton';
import Container from '../../common/styled/Container.css';
import RecoveryOption from './RecoveryOption';

const { fetchRecoveryMethods } = recoveryMethodsActions;

const StyledContainer = styled(Container)`
    button {
        margin-top: 50px !important;
        width: 100% !important;
    }

    h4 {
        margin-top: 40px;
        font-weight: 600;
        font-size: 15px;
        display: flex;
        align-items: center;
    }

`;

class SetupRecoveryMethod extends Component {

    state = {
        option: this.props.router.location.method || 'phrase',
        recoverySeedPhrase: null,
        settingUpNewAccount: false
    }

    async componentDidMount() {
        const { router } = this.props;
        const { method } = router.location;

        if (method) {
            this.setState({ option: method });
        }

        if (this.props.activeAccountId) {
            this.handleCheckMethodStatus();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.activeAccountId !== prevProps.activeAccountId) {
            this.handleCheckMethodStatus();
        }
    }

    handleCheckMethodStatus = () => {
        if (!this.checkNewAccount()) {
            this.props.fetchRecoveryMethods({ accountId: this.props.activeAccountId });
            this.props.getLedgerKey();
            this.props.get2faMethod();
        }
    }

    handleNext = async () => {
        const { option } = this.state;
        const {
            accountId,
            location,
            redirectTo
        } = this.props;

        if (option === 'phrase') {
            Mixpanel.track('SR-SP Select seed phrase');
            redirectTo(`/setup-seed-phrase/${accountId}/phrase${location.search}`);
        } else if (option === 'ledger') {
            Mixpanel.track('SR-Ledger Select ledger');
            redirectTo(`/setup-ledger/${accountId}${location.search}`);
        }
    }

    checkDisabled = (method) => {
        const { recoveryMethods } = this.props;
        let activeMethods = [];
        if (!!recoveryMethods.length) {
            activeMethods = recoveryMethods.filter((method) => method.confirmed).map((method) => method.kind);
        }

        return !this.checkNewAccount() && activeMethods.includes(method);
    }

    checkNewAccount = () => {
        return this.props.accountId !== this.props.activeAccountId;
    }

    render() {
        const { option } = this.state;
        const {
            mainLoader,
            accountId,
            activeAccountId,
            ledgerKey,
            twoFactor,
            recoveryMethodsLoader,
            continueSending,
        } = this.props;

        return (
            <StyledContainer className='small-centered border'>
                <form onSubmit={(e) => {
                    this.handleNext();
                    e.preventDefault();
                }}>
                    <h1><Translate id='setupRecovery.header' /></h1>
                    <h2><Translate id='setupRecovery.subHeader' /></h2>
                    <RecoveryOption
                        onClick={() => this.setState({ option: 'phrase' })}
                        option='phrase'
                        active={option}
                        disabled={this.checkDisabled('phrase')}
                    />
                    {(this.checkNewAccount() || !twoFactor) &&
                        <RecoveryOption
                            onClick={() => this.setState({ option: 'ledger' })}
                            option='ledger'
                            active={option}
                            disabled={ledgerKey !== null && accountId === activeAccountId}
                        />
                    }
                    <FormButton
                        color='blue'
                        type='submit'
                        disabled={mainLoader || recoveryMethodsLoader}
                        sending={continueSending}
                        trackingId='SR Click submit button'
                        data-test-id="submitSelectedRecoveryOption"
                    >
                        <Translate id='button.continue' />
                    </FormButton>
                </form>
            </StyledContainer>
        );
    }
}

const mapDispatchToProps = () => {
    const {
        initializeRecoveryMethod,
        redirectTo,
        getLedgerKey,
        get2faMethod,
    } = accountActions;

    return {
        fetchRecoveryMethods,
        initializeRecoveryMethod,
        getLedgerKey,
        get2faMethod,
        redirectTo,
    };
};

const mapStateToProps = (state, { match }) => {
    const accountId = match.params.accountId;

    return {
        ...selectAccountSlice(state),
        router: getRouter(state),
        accountId,
        activeAccountId: selectAccountId(state),
        recoveryMethods: selectRecoveryMethodsByAccountId(state, { accountId }),
        mainLoader: selectStatusMainLoader(state),
        recoveryMethodsLoader: selectRecoveryMethodsLoading(state, { accountId }),
        continueSending: selectActionsPending(state, { types: ['INITIALIZE_RECOVERY_METHOD', 'SETUP_RECOVERY_MESSAGE'] }),
    };
};

export const SetupRecoveryMethodWithRouter = connect(mapStateToProps, mapDispatchToProps())(SetupRecoveryMethod);
