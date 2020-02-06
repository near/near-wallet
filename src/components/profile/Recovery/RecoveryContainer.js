import React, { Component } from 'react';
import styled from 'styled-components';

import RecoveryMethod from './RecoveryMethod';

const Container = styled.div`

    border: 2px solid #e6e6e6;
    border-radius: 6px;
    color: black;
    font-weight: 600;
    white-space: nowrap;

    div {
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
        height: 37px;
    }

`

const Header = styled.div`
    padding: 20px !important;
    font-family: BwSeidoRound;
    color: #24272a;
    font-size: 22px;
`

class RecoveryContainer extends Component {

    render() {

        const { account } = this.props;

        // fakeAccount = this.props.account
        const fakeAccount = {
            recoveryMethods: {
                phone: {
                    enabled: true,
                    timeStamp: 'Jan 8, 2020'
                },
                email: {
                    enabled: false,
                    timeStamp: ''
                },
                phrase: {
                    enabled: false,
                    timeStamp: ''
                }
            }
        }

        return (
            <Container>
                <Header>Recovery Methods</Header>
                <RecoveryMethod
                    method='Phone Number'
                    methodData={fakeAccount.recoveryMethods.phone}
                    onEnable={() => {window.location.href = `/set-recovery/${account.accountId}`}}
                />
                <RecoveryMethod
                    method='Email Address'
                    methodData={fakeAccount.recoveryMethods.email}
                    onEnable={() => {window.location.href = `/set-recovery/${account.accountId}`}}
                />
                <RecoveryMethod
                    method='Seed Phrase'
                    methodData={fakeAccount.recoveryMethods.phrase}
                    onEnable={() => {window.location.href = `/setup-seed-phrase/${account.accountId}`}}
                />
            </Container>
        );
    }
}

export default RecoveryContainer;