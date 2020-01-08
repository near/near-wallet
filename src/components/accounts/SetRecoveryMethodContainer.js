import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../utils/account';
import { generateSeedPhrase } from '../../utils/seed-phrase'
import SetRecoveryMethod from './SetRecoveryMethod';
import SetRecoveryMethodSuccess from  './SetRecoveryMethodSuccess';
import AccountSkipThisStep from '../common/AccountSkipThisStep';
import Disclaimer from '../common/Disclaimer';
import {
    requestCode,
    setupRecoveryMessage,
    redirectToApp,
    clear,
    clearCode
} from '../../actions/account';

const Container = styled.div`
    form {
        max-width: 500px;

        h4 {
            margin-bottom: 0 !important;
    
            @media (max-width: 767px) {
                font-size: 14px !important;
            }
        }

        .email-input-wrapper {
            width: 100%;
        }

        .react-phone-number-input {
            position: relative;
        }

        .react-phone-number-input__country {
            position: absolute;
            top: 24px;
            right: 12px;
            z-index: 1;
        }

        .react-phone-number-input__country-select-arrow {
            display: none;
        }
    }

    input {
        border-radius: 3px;
    }

    h2 {
        color: #4a4f54 !important;
        margin: -20px 0 20px 0;

        @media (max-width: 767px) {
            margin: -10px 0 10px 0;
            font-size: 14px !important;
        }
    }

    .link {
        display: inline-block;
        margin-top: 10px;
    }

    .button {
        display: block;
    }

    .grid {
        margin: 0;

        @media (max-width: 767px) {
            .disclaimer {
                margin: 50px 0 0 0;
            }
        }
    }
`;

class SetRecoveryMethodContainer extends Component {

    state = {
        phoneNumber: '',
        email: '',
        recoverWithEmail: true,
        sentMessage: false
    }

    componentWillUnmount = () => {
        this.props.clear();
        this.props.clearCode();
    }

    handleFieldChange = (e, { name, value }) => {
        this.setState(() => ({ [name]: value }))
    }

    handleToggleRecoverMethod = () => {
        this.setState(prevState => ({
            recoverWithEmail: !prevState.recoverWithEmail
        }));
    }

    isLegitField = (name) => {
        let validators = {
            phoneNumber: isValidPhoneNumber,
            email: validateEmail
        }
        const value = this.state[name];
        return validators[name](value);
    }

    get isLegit() {
        return this.state.recoverWithEmail ? this.isLegitField('email') : this.isLegitField('phoneNumber');
    }

    handleSubmitRecoverMethod = () => {
        if (!this.state.sentMessage) {
            const { seedPhrase, publicKey } = generateSeedPhrase()

            this.props.setupRecoveryMessage({...this.props, ...this.state, publicKey, seedPhrase })
                .then(({ error }) => {
                    if (error) return

                    this.setState({ sentMessage: true })
                })
        }
    }

    handleEnterNewRecoverValue = () => {
        this.setState({
            email: '',
            phoneNumber: '',
            sentMessage: false
        });
    }

    skipRecoverySetup = () => {
        let nextUrl = `/setup-seed-phrase/${this.props.accountId}`;
        this.props.history.push(nextUrl);
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.isLegit && !this.props.formLoader
        }

        const { sentMessage } = this.state;

        return (
            <Container className='ui container'>
                {!sentMessage &&
                    <>
                        <SetRecoveryMethod
                            {...combinedState}
                            toggleRecoverMethod={this.handleToggleRecoverMethod}
                            handleFieldChange={this.handleFieldChange}
                            submitRecovery={this.handleSubmitRecoverMethod}
                        />
                        <AccountSkipThisStep skipRecoverySetup={this.skipRecoverySetup} />

                    </>
                }
                {sentMessage &&
                    <SetRecoveryMethodSuccess
                        {...combinedState}
                        handleConfirmMessageReceived={this.props.redirectToApp}
                        handleEnterNewRecoverValue={this.handleEnterNewRecoverValue}
                    />
                }
                <Disclaimer/>
            </Container>
        )
    }
}

const mapDispatchToProps = {
    requestCode,
    setupRecoveryMessage,
    redirectToApp,
    clear,
    clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetRecoveryMethodContainerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetRecoveryMethodContainer);
