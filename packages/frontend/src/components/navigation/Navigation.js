import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { actions as ledgerActions, selectLedgerConnectionAvailable, selectLedgerHasLedger } from '../../redux/slices/ledger';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const { handleConnectLedger } = ledgerActions;

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
    const dispatch = useDispatch();

    const [menuOpen, setMenuOpen] = useState(false);

    const ledgerConnectionAvailable = useSelector(selectLedgerConnectionAvailable);
    const hasLedger = useSelector(selectLedgerHasLedger);

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

        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || (!desktopMenu?.contains(e.target) && !mobileMenu?.contains(e.target))) {
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

    const connectLedger =  () => dispatch(handleConnectLedger()).unwrap();

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
                connectLedger={connectLedger}
                ledgerConnectionAvailable={ledgerConnectionAvailable}
                hasLedger = {hasLedger}
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
