import React, { Component } from 'react';
import styled from 'styled-components';
import RecoveryMethod from './RecoveryMethod';
import RecoveryIcon from '../../../images/icon-recovery-grey.svg';
import ErrorIcon from '../../../images/icon-problems.svg';

const Container = styled.div`

    border: 2px solid #e6e6e6;
    border-radius: 6px;
    white-space: nowrap;

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
    white-space: normal;
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

    handleEnableMethod = (method) => {
        window.location.href = `${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${this.props.account.accountId}`
    }

    handleResendLink = (method) => {
        //TODO: Send sms/email depending on method
    }
 
    render() {

        const { account, hasRecoveryMethod } = this.props;

        return (
            <Container>
                <Header>
                    <Title>
                        Recovery Methods
                    </Title>
                    {!hasRecoveryMethod &&
                        <NoRecoveryMethod>
                            You have no method to recover your account. please add a method below.
                        </NoRecoveryMethod>
                    }
                </Header>
                {account.recoveryMethods.map((method, i) =>
                    <RecoveryMethod
                        key={i}
                        data={method}
                        onEnable={() => this.handleEnableMethod(method.method)}
                        onResend={() => this.handleResendLink(method.method)}
                    />
                )}
            </Container>
        );
    }
}

export default RecoveryContainer;