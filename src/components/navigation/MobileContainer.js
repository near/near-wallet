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
import LanguageToggle from '../common/LangSwitcher';
import languagesIcon from '../../images/icon-languages.svg';
import { Translate } from 'react-localize-redux';

const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    font-family: 'benton-sans',sans-serif;
    background-color: #24272a;
    height: 70px;
    top: 0;
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

const Lang = styled.div`
    border-top: 1px solid #404040;
    margin-top: 15px;
    padding: 15px 0;
    position: relative;

    &:after {
        content: '';
        border-color: #f8f8f8a1;
        border-style: solid;
        border-width: 2px 2px 0 0;
        display: inline-block;
        position: absolute;
        right: 10px;
        top: calc(50% - 10px);
        transform: rotate(135deg) translateY(-50%);
        height: 9px;
        width: 9px;
        z-index: 1;
    }

    &:last-child {
        border-top: 0;
        margin-top: 0;
        margin-left: auto;
        padding: 0;

        .lang-selector {
            color: #24272a;
            width: 54px;
        }
    }

    .lang-selector {
        appearance: none;
        background: transparent url(${languagesIcon}) no-repeat 2px center / 24px 24px;
        border: 0;
        color: #f8f8f8;
        height: 32px;
        outline: none;
        text-indent: 54px;
        width: 100%;
    }

    &.mobile-lang .lang-selector  {
        &:active,
        &:focus,
        &:hover {
            background-color: #24272a;
            color: #f8f8f8;

            option {
                border: 0;
            }
        }
    }
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
                                <UserBalance balance={account.balance}/>
                            </User>
                            <MenuButton onClick={toggleMenu} open={menuOpen}/>
                        </>
                    }
                    {!showNavLinks &&
                        <Lang>
                            <LanguageToggle />
                        </Lang>
                    }
                </Collapsed>
                {menuOpen &&
                    <>
                        <NavLinks/>
                        <UserLinks accountId={account.accountId}/>
                        <Lang className="mobile-lang">
                            <LanguageToggle />
                        </Lang>
                        <LowerSection>
                            <h6><Translate id='link.switchAccount'/></h6>
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