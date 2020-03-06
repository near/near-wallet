import React, { Component } from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import UserBalance from './UserBalance';
import UserName from './UserName';
import MenuButton from './MenuButton';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 15px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 9px -1px rgba(0,0,0,0.17);
    font-family: 'benton-sans',sans-serif;
    background-color: #24272a;
    position: sticky;
    height: 70px;
    top: 0;
    z-index: 1000;
    align-items: center;

    @media (max-width: 768px) {
        display: flex;
    }

    .logo {
        margin-left: 7px;
    }

    .hamburger {
        margin-left: auto;
        margin-right: 20px;
    }
`

const User = styled.div`
    margin-left: 10px;
`

class MobileContainer extends Component {
    render() {

        const { account } = this.props;

        return (
            <Container>
                <Logo/>
                <User>
                    <UserName accountId={account.accountId}/>
                    <UserBalance amount={account.amount}/>
                </User>
                <MenuButton/>
            </Container>
        )
    }
}

export default MobileContainer;