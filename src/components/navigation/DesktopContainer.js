import React, { Component } from 'react';
import styled from 'styled-components';
import helpIcon from '../../images/icon-help.svg';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserBalance from './UserBalance';
import UserName from './UserName';
import DesktopMenu from './DesktopMenu';
import ClickOutside from '../common/ClickOutside';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 15px;
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
    max-width: 190px;
    margin-left: 20px;
    padding: 0 50px 0 20px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;

    &:after {
        content: '';
        border-color: #f8f8f8;
        border-style: solid;
        border-width: 1px 1px 0 0;
        display: inline-block;
        position: absolute;
        right: 25px;
        top: calc(50% - 10px);
        transform: rotate(135deg) translateY(-50%);
        height: 9px;
        width: 9px;
    }

    &.open {
        &:after {
            transform: rotate(135deg) translateY(-50%);
            top: calc(50% - 6px);
            right: 25px;
            border-width: 0px 0px 1px 1px;
        }
    }
`

class DesktopContainer extends Component {
    render() {

        const {
            account,
            menuOpen,
            toggleMenu,
            closeMenu,
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
                        <Help href='http://near.chat/'>Help</Help>
                        <ClickOutside onClickOutside={closeMenu}>
                            <User onClick={toggleMenu} className={menuOpen ? 'open' : ''}>
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
                        </ClickOutside>
                    </>
                }
            </Container>
        )
    }
}

export default DesktopContainer;