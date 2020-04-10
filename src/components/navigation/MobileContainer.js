import React, { Component } from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import UserBalance from './UserBalance';
import UserName from './UserName';
import MenuButton from './MenuButton';
import NavLinks from './NavLinks';
import UserLinks from './UserLinks';
import UserAccounts from './UserAccounts';
import CreateAccountBtn from './CreateAccountBtn';
import { IS_MAINNET } from '../../utils/wallet';

const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    font-family: 'benton-sans',sans-serif;
    background-color: #24272a;
    height: 70px;
    top: ${IS_MAINNET ? '0' : '35px'};
    z-index: 1000;
    padding: 0 15px;
    position: fixed;
    right: 0;
    left: 0;
    box-shadow: 0px 5px 9px -1px rgba(0,0,0,0.17);
    transition: 300ms;

    ::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 991px) {
        display: block;
    }

    .user-links {
        margin-top: 15px;

        a {
            padding: 10px 0;
        }
    }

    h6 {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 500;
    }

    &.show {
        height: 100%;
        top: 0;
        bottom: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }
`

const Collapsed = styled.div`
    height: 70px;
    display: flex;
    align-items: center;

    .logo {
        margin-left: -12px;
    }

    .menu-btn {
        position: absolute;
        right: 20px;
        top: 25px;
    }
`

const User = styled.div`
    margin-left: 10px;
`

const LowerSection = styled.div`
    background-color: black;
    margin: 10px -20px 0 -20px;
    padding: 20px 20px 100% 20px;
`

class MobileContainer extends Component {
    render() {

        const {
            account,
            selectAccount,
            availableAccounts,
            menuOpen,
            toggleMenu,
            showNavLinks
        } = this.props;

        return (
            <Container className={menuOpen ? 'show' : ''} id='mobile-menu'>
                <Collapsed>
                    <Logo/>
                    {showNavLinks &&
                        <>
                            <User>
                                <UserName accountId={account.accountId}/>
                                <UserBalance amount={account.amount}/>
                            </User>
                            <MenuButton onClick={toggleMenu} open={menuOpen}/>
                        </>
                    }
                </Collapsed>
                {menuOpen &&
                    <>
                        <NavLinks/>
                        <UserLinks accountId={account.accountId}/>
                        <LowerSection>
                            <h6>Switch Account</h6>
                            <UserAccounts
                                accounts={availableAccounts}
                                accountId={account.accountId}
                                selectAccount={selectAccount}
                            />
                            <CreateAccountBtn/>
                        </LowerSection>
                    </>
                }
            </Container>
        )
    }
}

export default MobileContainer;