import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import styled from 'styled-components';

import { isWhitelabel } from '../../config/whitelabel';
import languagesIcon from '../../images/icon-languages.svg';
import AccountSelector from '../accounts/account_selector/AccountSelector';
import LanguageToggle from '../common/LangSwitcher';
import UserIcon from '../svg/UserIcon';
import AccessAccountBtn from './AccessAccountBtn';
import CreateAccountBtn from './CreateAccountBtn';
import DeprecatedLogo from './DeprecatedLogo';
import Logo from './Logo';
import NavLinks from './NavLinks';
import UserAccount from './UserAccount';

const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    margin-bottom: 20px;
    background-color: white;
    height: 70px;
    position: relative;
    padding: 0 14px;
    border-bottom: 1px solid #F0F0F1;
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
        background-color: #FAFAFA;
        a {
            padding: 17px 14px;
            border-top: 1px solid #efefef;
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
`;

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
            fill: #E5E5E6;
        }
    }
`;

const LowerSection = styled.div`
    background-color: white;
    margin: 0px -20px 0 -20px;
    padding: 20px 20px 100% 20px;
`;

const Lang = styled.div`
    border-top: 1px solid #efefef;
    padding: 14px;
    position: relative;
    max-height: 58px;
    margin: 0 -14px;

    &.mobile-lang {
        background-color: #FAFAFA;
        border-bottom: 1px solid #efefef;
    }

    &:after {
        content: '';
        border-color: #72727A;
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
        color: #72727A;
        cursor: pointer;
        height: 32px;
        outline: none;
        padding-right: 62px;
        position: relative;
        width: 100%;
        z-index: 1;
        text-indent: 54px;
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
`;

class MobileContainer extends Component {
    render() {

        const {
            account,
            handleSelectAccount,
            availableAccounts,
            menuOpen,
            toggleMenu,
            showNavLinks,
            flowLimitationMainMenu,
            flowLimitationSubMenu,
            refreshBalance
        } = this.props;

        return (
            <Container className={menuOpen ? 'show' : ''} id='mobile-menu'>
                <Collapsed>
                    {
                        isWhitelabel() ?
                            <Logo link={!flowLimitationMainMenu} mode='mobile' /> :
                            <DeprecatedLogo link={!flowLimitationMainMenu}/>
                    }
                    {showNavLinks && (
                        <>
                            <UserAccount
                                accountId={account.accountId || account.localStorage?.accountId}
                                onClick={toggleMenu}
                                withIcon={false}
                                flowLimitationSubMenu={flowLimitationSubMenu}
                            />
                            <UserIcon background={true} color='#A2A2A8' onClick={!flowLimitationSubMenu ? toggleMenu : null}/>
                        </>
                    )}
                    {!showNavLinks && (
                        <Lang>
                            <LanguageToggle />
                        </Lang>
                    )}
                </Collapsed>
                {menuOpen && (
                    <>
                        <NavLinks />
                        <Lang className="mobile-lang">
                            <LanguageToggle />
                        </Lang>
                        <LowerSection>
                            <h6><Translate id='link.switchAccount' /></h6>
                            <AccountSelector
                                signedInAccountId={account.localStorage?.accountId}
                                availableAccounts={availableAccounts}
                                accountsBalances={account.accountsBalance}
                                getAccountBalance={refreshBalance}
                                onSelectAccount={handleSelectAccount}
                                showBalanceInUSD={true}
                            />
                            <AccessAccountBtn />
                            <CreateAccountBtn />
                        </LowerSection>
                    </>
                )}
            </Container>
        );
    }
}

export default MobileContainer;
