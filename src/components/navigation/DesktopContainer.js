import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';
import helpIcon from '../../images/icon-help.svg';
import languagesIcon from '../../images/icon-languages.svg';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserAccount from './UserAccount';
import DesktopMenu from './DesktopMenu';
import LanguageToggle from '../common/LangSwitcher';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 14px;
    margin-bottom: 20px;
    padding: 0 15px;
    box-shadow: 0px 5px 9px -1px rgba(0,0,0,0.17);

    @media (min-width: 992px) {
        display: flex;
    }

    background-color: #272729;
    height: 70px;
    align-items: center;

    img {
        width: 180px;
    }

    .click-outside {
        position: relative;
    }

    .divider {
        height: 35px;
        width: 2px;
        background-color: #5d5f60;
        margin: 0 20px;
    }
`
const Help = styled.a`
    color: white;
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
    padding-top: 2px;
    
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
        margin-top: -2px;
    }
`

const Lang = styled.div`
    margin-left: 20px;
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
    }

    &:last-child {
        margin-right: 15px;
    }

    .lang-selector {
        appearance: none;
        background: transparent url(${languagesIcon}) no-repeat 5px center / 20px 20px;
        border: 0;
        cursor: pointer;
        font-size: 16px;
        height: 32px;
        outline: none;
        padding-right: 54px;
        position: relative;
        user-select: none;
        width: 54px;
        z-index: 1;

        &::-ms-expand {
            display: none;
        }
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
                    <NavLinks />
                }
                <Help href='https://nearhelp.zendesk.com/' target='_blank' rel='noopener noreferrer'>
                    <Translate id='link.help'/>
                </Help>
                <Lang>
                    <LanguageToggle />
                </Lang>
                {showNavLinks &&
                    <>
                        <div className='divider'/>
                        <UserAccount accountId={account.accountId} onClick={toggleMenu}/>
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