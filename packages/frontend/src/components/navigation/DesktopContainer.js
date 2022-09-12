import React, { useMemo } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import ConnectLedger from './ConnectLedger';
import DesktopMenu from './DesktopMenu';
import NavLinks from './NavLinks';
import UserAccount from './UserAccount';

const Container = styled.div`
    display: none;
    color: white;
    position: relative;
    font-size: 14px;
    padding: 30px 30px 30px 40px;
    background: ${COLORS.darkGray};
    border-radius: 30px;

    @media (min-width: 992px) {
        display: flex;
    }
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

const Logo = styled.span({
    fontWeight: 900,
    fontSize: 40,
    lineHeight: '30px',
    color: COLORS.green,
});

const DesktopContainer = (props) => {
    const {
        account,
        menuOpen,
        toggleMenu,
        availableAccounts,
        handleSelectAccount,
        showNavLinks,
        flowLimitationMainMenu,
        flowLimitationSubMenu,
        refreshBalance,
    } = props;

    const showAllNavigationLinks = useMemo(() => (
        showNavLinks && !flowLimitationMainMenu
    ), [showNavLinks, flowLimitationMainMenu]);

    return (
        <Container>
            <Logo>NEXT.</Logo>
            {showAllNavigationLinks && <NavLinks />}
            <ConnectLedger />
            {showNavLinks && (
                <>
                    <UserAccount
                        accountId={account.accountId || account.localStorage?.accountId}
                        onClick={toggleMenu}
                        flowLimitationSubMenu={flowLimitationSubMenu}
                    />
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
                    />
                </>
            )}
        </Container>
    );
};

export default DesktopContainer;
