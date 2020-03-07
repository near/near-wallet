import React, { Component } from 'react';
import styled from 'styled-components';
import helpIcon from '../../images/icon-help.svg';
import userIcon from '../../images/user-icon-grey.svg';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserBalance from './UserBalance';
import UserName from './UserName';
import DesktopMenu from './DesktopMenu';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 14px;
    margin-bottom: 20px;
    box-shadow: 0px 5px 9px -1px rgba(0,0,0,0.17);

    @media (min-width: 769px) {
        display: flex;
    }

    font-family: 'benton-sans',sans-serif;
    background-color: #24272a;
    position: sticky;
    height: 70px;
    top: 0;
    z-index: 1000;
    align-items: center;

    img {
        width: 180px;
    }

    .click-outside {
        position: relative;
    }
`

const Help = styled.a`
    color: white;
    display: flex;
    align-items: center;
    margin-left: auto;
    text-transform: uppercase;
    cursor: pointer;
    line-height: normal;
    letter-spacing: 2px;

    &:hover {
        color: white;
        text-decoration: none;
    }

    &:before {
        content: '';
        background: url(${helpIcon});
        background-repeat: no-repeat;
        display: inline-block;
        width: 23px;
        height: 23px;
        margin-right: 10px;
    }
`

const User = styled.div`
    border-left: 2px solid #5d5f60;
    position: relative;
    min-width: 150px;
    max-width: 280px;
    margin-left: 20px;
    padding: 0 50px 0 20px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;

    .user-name {
        margin-left: 10px;
    }

    .user-balance {
        margin-left: 10px;
        white-space: nowrap;
        background-color: black;
        padding: 2px 10px;
        border-radius: 40px;
        line-height: normal;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 920px) {
        flex-direction: column;
        align-items: flex-start;
    }

    &:after {
        content: '';
        border-color: #f8f8f8a1;
        border-style: solid;
        border-width: 2px 2px 0 0;
        display: inline-block;
        position: absolute;
        right: 25px;
        top: calc(50% - 10px);
        transform: rotate(135deg) translateY(-50%);
        height: 9px;
        width: 9px;
    }
`

const UserIcon = styled.div`
    display: none;
    background: url(${userIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 21px;
    min-width: 35px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #545454;

    @media (min-width: 940px) {
        display: inline-block;
    }
`

class DesktopContainer extends Component {
    render() {

        const {
            account,
            menuOpen,
            toggleMenu,
            availableAccounts,
            selectAccount,
            showNavLinks
        } = this.props;

        return (
            <Container>
                <Logo/>
                {showNavLinks &&
                    <>
                        <NavLinks/>
                        <Help href='http://near.chat/' target='_blank' rel='noopener noreferrer'>Help</Help>
                        <User onClick={toggleMenu}>
                            <UserIcon/>
                            <UserName accountId={account.accountId}/>
                            <UserBalance amount={account.amount}/>
                        </User>
                        <DesktopMenu
                            show={menuOpen}
                            toggleMenu={toggleMenu}
                            accountId={account.accountId}
                            accounts={availableAccounts}
                            selectAccount={selectAccount}
                        />
                    </>
                }
            </Container>
        )
    }
}

export default DesktopContainer;