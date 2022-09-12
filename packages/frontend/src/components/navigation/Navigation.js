import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../utils/theme';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const Container = styled.div`
    &&& {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 40px 80px 0px;
        background: ${COLORS.black};
        font-family: 'Poppins', sans-serif;
        @media (max-width: 991px) {
            bottom: ${(props) => props.open ? '0' : 'unset'};
            padding: 0px;
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

export default (
    {
        selectAccount,
        showNavLinks,
        flowLimitationMainMenu,
        flowLimitationSubMenu,
        refreshBalance,
        availableAccounts,
        account
    }
) => {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [menuOpen]);

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('click', handleClick);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
        }
    }, [menuOpen]);

    const handleKeyDown = useCallback((e) => {
        if (e.keyCode === 27) {
            setMenuOpen(false);
        }
    }, []);

    const handleClick = useCallback((e) => {
        const desktopMenu = document.getElementById('desktop-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (e.target.tagName === 'SPAN') {
            return false;
        }

        if (
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'A' ||
            (!desktopMenu?.contains(e.target) &&
                !mobileMenu?.contains(e.target))
        ) {
            setMenuOpen(false);
        }
    }, []);

    const toggleMenu = useCallback(() => {
        if (menuOpen) {
            setMenuOpen(false);
        } else {
            setMenuOpen(true);
        }
    }, [menuOpen]);

    const handleSelectAccount = useCallback((accountId) => {
        selectAccount(accountId);
        setMenuOpen(false);
    }, []);

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
