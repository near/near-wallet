import React, { Component } from 'react';
import styled from 'styled-components';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserLinks from './UserLinks';
import UserAccounts from './UserAccounts';
import CreateAccountBtn from './CreateAccountBtn';
import LanguageToggle from '../common/LangSwitcher';
import languagesIcon from '../../images/icon-languages.svg';
import { Translate } from 'react-localize-redux';
import AccessAccountBtn from './AccessAccountBtn';
import UserAccount from './UserAccount';
import UserIcon from '../svg/UserIcon';

const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    background-color: #24272a;
    height: 70px;
    position: relative;
    padding: 0 14px;
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
        font-size: 13px !important;
        margin-bottom: 10px !important;
        color: #D5D4D8;
        font-weight: normal !important;
    }

    &.show {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .user-name {
        max-width: 200px;
        white-space: nowrap;
    }

    .nav-links {
        margin: 0 -14px;

        a {
            padding: 17px 14px;
            border-top: 1px solid #3F4045;
            width: 100%;
            max-height: 58px;

            svg {
                margin-right: 15px;
            }

            .user-icon {
                margin-left: -7px;
                margin-right: 10px;
            }
        }
    }
`

const Collapsed = styled.div`
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .user-account {
        padding: 4px 5px 4px 4px;
    }

    .user-icon {
        .background {
            fill: black;
        }
    }
`

const LowerSection = styled.div`
    background-color: #3F4045;
    margin: 0px -20px 0 -20px;
    padding: 20px 20px 100% 20px;
`

const Lang = styled.div`
    border-top: 1px solid #404040;
    padding: 14px;
    position: relative;
    max-height: 58px;
    margin: 0 -14px;

    &:after {
        content: '';
        border-color: #f8f8f8a1;
        border-style: solid;
        border-width: 2px 2px 0 0;
        display: inline-block;
        position: absolute;
        right: 24px;
        top: calc(50% - 10px);
        transform: rotate(135deg) translateY(-50%);
        height: 9px;
        width: 9px;
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
        background: transparent url(${languagesIcon}) no-repeat 0px center / 24px 24px;
        border: 0;
        color: #D5D4D8;
        cursor: pointer;
        height: 32px;
        outline: none;
        padding-right: 54px;
        position: relative;
        width: 100%;
        z-index: 1;
    }

    &.mobile-lang .lang-selector  {
        text-indent: 32px;

        &:active,
        &:focus,
        &:hover {
            option {
                background-color: #24272a;
                border: 0;
                color: #f8f8f8;
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
                            <UserAccount accountId={account.accountId} onClick={toggleMenu} withIcon={false}/>
                            <UserIcon background={true} color='#D5D4D8' onClick={toggleMenu}/>
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
                        <NavLinks />
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
                            <AccessAccountBtn/>
                            <CreateAccountBtn/>
                        </LowerSection>
                    </>
                }
            </Container>
        )
    }
}

export default MobileContainer;