import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const Container = styled.div`
    &&& {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        @media (max-width: 991px) {
            bottom: ${(props) => props.open ? '0' : 'unset'};
        }

        h6 {
            font-size: 13px;
            margin-bottom: 5px;
            color: #72727A;
            font-weight: normal;
        }

        .account-selector {
            padding: 0;
            box-shadow: none;
            border-radius: 0;
        }
    }
`;

export default ({
    selectAccount,
    showNavLinks,
    flowLimitationMainMenu,
    flowLimitationSubMenu,
    refreshBalance,
    availableAccounts,
    account
}) => {

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('click', handleClick);
        }
    }, [menuOpen]);

    const handleCloseMenu = () => {
        setMenuOpen(false);
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('click', handleClick);
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 27) {
            handleCloseMenu();
        }
    };

    const handleClick = (e) => {
        const desktopMenu = document.getElementById('desktop-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (e.target.tagName === 'SPAN') {
            return false;
        }

        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || (!desktopMenu?.contains(e.target) && !mobileMenu?.contains(e.target))) {
            handleCloseMenu();
        }
    };

    const toggleMenu = () => {
        if (menuOpen) {
            handleCloseMenu();
        } else {
            setMenuOpen(true);
        }
    };

    const handleSelectAccount = (accountId) => {
        selectAccount(accountId);
        handleCloseMenu();
    };
    
    return (
        <Container id='nav-container' open={menuOpen}>
            <DesktopContainer
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                handleSelectAccount={handleSelectAccount}
                showNavLinks={showNavLinks}
                flowLimitationMainMenu={flowLimitationMainMenu}
                flowLimitationSubMenu={flowLimitationSubMenu}   
                refreshBalance={refreshBalance}
                availableAccounts={availableAccounts}
                account={account}
            />
            <MobileContainer
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                handleSelectAccount={handleSelectAccount}
                showNavLinks={showNavLinks}
                flowLimitationMainMenu={flowLimitationMainMenu}
                flowLimitationSubMenu={flowLimitationSubMenu}   
                refreshBalance={refreshBalance}
                availableAccounts={availableAccounts}
                account={account}
            />
        </Container>
    );
};
