import React, { Component } from 'react';
import styled from 'styled-components';

import DeprecatedLogo from './DeprecatedLogo';
import DesktopMenu from './DesktopMenu';
import Logo from './Logo';
import NavLinks from './NavLinks';
import { isWhitelabel } from '../../config/whitelabel';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 14px;
    padding: 0 15px;

    @media (min-width: 992px) {
        display: flex;
        justify-content: space-between;
    }

    background-color: white;
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
        background-color: #E5E5E6;
        margin: 0 20px;
    }
`;


class DesktopContainer extends Component {
    render() {
        const {
            account,
            menuOpen,
            toggleMenu,
            availableAccounts,
            handleSelectAccount,
            showNavLinks,
            flowLimitationMainMenu,
            refreshBalance,
            onClickCreateNewAccount
        } = this.props;

        const showAllNavigationLinks = showNavLinks && !flowLimitationMainMenu;

        return (
            <Container>
                {
                    isWhitelabel ?
                        <Logo link={!flowLimitationMainMenu}/> :
                        <DeprecatedLogo link={!flowLimitationMainMenu}/>
                }
                {showAllNavigationLinks && account.accountId &&
                    <NavLinks />
                }
                {showNavLinks && (
                    <DesktopMenu
                        show={menuOpen}
                        toggleMenu={toggleMenu}
                        accountId={account.accountId}
                        accountIdLocalStorage={account.localStorage?.accountId}
                        accounts={availableAccounts}
                        handleSelectAccount={handleSelectAccount}
                        accountsBalance={account.accountsBalance}
                        balance={account.balance}
                        refreshBalance={refreshBalance}
                        onClickCreateNewAccount={onClickCreateNewAccount}
                    />
                )}
            </Container>
        );
    }
}

export default DesktopContainer;
