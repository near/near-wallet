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

    handleEnableMethod = (method) => {
        window.location.href = `${method !== 'phrase' ? '/set-recovery/' : '/setup-seed-phrase/'}${this.props.account.accountId}`
    }
 
    render() {

        const { account } = this.props;

        return (
            <Container>
                <Header>Recovery Methods</Header>
                {account.recoveryMethods.map((method, i) =>
                    <RecoveryMethod
                        key={i}
                        data={method}
                        onEnable={() => this.handleEnableMethod(method.method)}
                    />
                )}
            </Container>
        );
    }
}

export default RecoveryContainer;