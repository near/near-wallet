import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { WalletSelectorGetAWallet } from '../common/wallet_selector/WalletSelectorGetAWallet';
import DesktopContainer from './DesktopContainer';
import MobileContainer from './MobileContainer';

const Container = styled.div`
    &&& {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        border-bottom: 1px solid #F0F0F1;
        background-color: #FFFFFF;
        margin: auto;
        padding: 0 64px;

        @media (max-width: 991px) {
            padding: 0 24px;
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

const InnerContainer = styled.div`
    &&& {
        max-width: 1224px;
        margin: 0 auto;
    }
`;

export default ({
    selectAccount,
    showNavLinks,
    flowLimitationMainMenu,
    flowLimitationSubMenu,
    refreshBalance,
    availableAccounts,
    account,
    history,
    onTransfer
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [walletSelectorModal, setWalletSelectorModal] = useState();
    const [showModal, setShowModal] = useState();

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

    const handleOnClickCreateNewAccount = () => {
        setShowModal('more-near-wallets');
    };

    return (
        <Container id='nav-container' open={menuOpen}>
            <InnerContainer>
                <WalletSelectorGetAWallet
                    setWalletSelectorModal={(modal) => setWalletSelectorModal(modal)}
                    setShowModal={(modal) => {
                        setShowModal(null);
                        if (modal === 'wallet-selector') {
                            walletSelectorModal.show();
                        }
                    }}
                    showModal={showModal}
                />
                <DesktopContainer
                    menuOpen={menuOpen}
                    onTransfer={onTransfer}
                    toggleMenu={toggleMenu}
                    handleSelectAccount={handleSelectAccount}
                    showNavLinks={showNavLinks}
                    flowLimitationMainMenu={flowLimitationMainMenu}
                    flowLimitationSubMenu={flowLimitationSubMenu}
                    refreshBalance={refreshBalance}
                    availableAccounts={availableAccounts}
                    account={account}
                    onClickCreateNewAccount={handleOnClickCreateNewAccount}
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
                    onClickCreateNewAccount={handleOnClickCreateNewAccount}
                />
            </InnerContainer>
        </Container>
    );
};
