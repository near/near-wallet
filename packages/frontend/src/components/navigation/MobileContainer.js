import React from 'react';
import { Translate } from 'react-localize-redux';
import { NavLink as ReactNavLink } from 'react-router-dom';
import styled from 'styled-components';

import AccountSelector from '../accounts/account_selector/AccountSelector';
import MenuIcon from '../svg/MenuIcon';
import ProfileIcon from '../svg/ProfileIcon';
import AccessAccountBtn from './AccessAccountBtn';
import CreateAccountBtn from './CreateAccountBtn';
import NavLinks from './NavLinks';


const Container = styled.div`
    display: none;
    color: white;
    font-size: 15px;
    position: relative;
    padding: 32px 14px 0;
    transition: 300ms;

    ::-webkit-scrollbar {
        display: none;
    }

    @media (max-width: 991px) {
        display: block;
        background-color: #111111;
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
        @media (max-width: 991px) {
            background-color: transparent;
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin: 0 30px;
            background: #293933;
            border-radius: 15px;

            a {
                border-top: none;
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
    padding: 20px;
`;

const Logo = styled.span`
    font-weight: 900;
    font-size: 40px;
    line-height: 30px;
    color: #05DF85;
    font-family: 'Poppins',sans-serif;
`;

const MobileContainer = (
    {
        account,
        handleSelectAccount,
        availableAccounts,
        menuOpen,
        toggleMenu,
        showNavLinks,
        refreshBalance
    }
) => (
    <Container className={menuOpen ? 'show' : ''} id='mobile-menu'>
        <Collapsed>
            {showNavLinks && (
                <>
                    <MenuIcon onClick={toggleMenu} style={{ cursor: 'pointer' }}/>
                    <Logo>NEXT.</Logo>
                    <ReactNavLink to='/profile'>
                        <ProfileIcon />
                    </ReactNavLink>
                </>
            )}
        </Collapsed>
        {menuOpen && (
            <>
                <NavLinks />
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

export default MobileContainer;
