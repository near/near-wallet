import React, { Component } from 'react';
import styled from 'styled-components';
import ActiveMethod from './ActiveMethod';
import InactiveMethod from './InactiveMethod';
import RecoveryIcon from '../../../images/icon-recovery-grey.svg';
import ErrorIcon from '../../../images/icon-problems.svg';
import {Snackbar, snackbarDuration } from '../../common/Snackbar';
import { Translate } from 'react-localize-redux';

const Container = styled.div`

    border: 2px solid #e6e6e6;
    border-radius: 6px;

    > div {
        padding: 15px 20px;
        border-bottom: 2px solid #f8f8f8;

        &:last-of-type {
            border-bottom: 0;
        }
    }

    button {
        font-size: 14px;
        width: 100px;
        font-weight: 600;
        height: 40px;
        letter-spacing: 0.5px;
    }

`

const Header = styled.div`
    padding: 20px !important;
`

const Title = styled.div`
    font-family: BwSeidoRound;
    color: #24272a;
    font-size: 22px;
    display: flex;
    align-items: center;

    &:before {
        content: '';
        background: center center no-repeat url(${RecoveryIcon});
        width: 28px;
        height: 28px;
        display: inline-block;
        margin-right: 10px;
        margin-top: -2px;
    }
`

const NoRecoveryMethod = styled.div`
    margin-top: 15px;
    color: #FF585D;
    display: flex;
    align-items: center;

    &:before {
        content: '';
        background: center center no-repeat url(${ErrorIcon});
        min-width: 28px;
        width: 28px;
        min-height: 28px;
        height: 28px;
        display: block;
        margin-right: 10px;
    }
`

class RecoveryContainer extends Component {

    state = {
        successSnackbar: false,
    };

    handleEnableMethod = (method) => {
        window.location.href = `${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${this.props.account.accountId}`
    }

    handleResendLink = (method) => {
        //TODO: Send sms/email depending on method
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({successSnackbar: false});
            }, snackbarDuration)
        });
    }
 
    render() {

        const { activeMethods } = this.props;

        const allMethods = ['email', 'phone', 'phrase'];
        const inactiveMethods = allMethods.filter((method) => !activeMethods.map(method => method.kind).includes(method));

        return (
            <Container>
                <Header>
                    <Title><Translate id='recoveryMgmt.title'/></Title>
                    {false &&
                        <NoRecoveryMethod>
                            <Translate id='recoveryMgmt.noRecoveryMethod'/>
                        </NoRecoveryMethod>
                    }
                </Header>
                {activeMethods.map((method, i) =>
                    <ActiveMethod
                        key={i}
                        data={method}
                        onResend={() => this.handleResendLink(method.kind)}
                    />
                )}
                {inactiveMethods.map((method, i) =>
                    <InactiveMethod
                        key={i}
                        kind={method}
                        onEnable={() => this.handleEnableMethod(method)}
                    />
                )}
                <Snackbar
                    theme='success'
                    message={<Translate id='recoveryMgmt.recoveryLinkSent'/>}
                    show={this.state.successSnackbar}
                    onHide={() => this.setState({ successSnackbar: false })}
                />
            </Container>
        );
    }
}

export default RecoveryContainer;