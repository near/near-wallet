import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNearWallet } from '@near-wallet-selector/near-wallet';
import { setupNearFi } from '@near-wallet-selector/nearfi';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupOptoWallet } from '@near-wallet-selector/opto-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupWelldoneWallet } from '@near-wallet-selector/welldone-wallet';
import React, { useEffect } from 'react';

import { IS_MAINNET } from '../../../config';
import MoreNearWalletsModal from './MoreNearWalletsModal';
import '@near-wallet-selector/modal-ui/styles.css';

// This Wallet Selector component is for displaying a list of available wallets only.
// The Wallet Selector CSS has been modified to omit the 'Connect a wallet' section.

export function WalletSelectorGetAWallet({
    setWalletSelectorModal,
    showModal,
    setShowModal
}) {

    const walletWrapperDiv = document.getElementById('near-wallet-selector-modal');
    walletWrapperDiv?.classList.add('wallet-selector-get-a-wallet-modal');

    useEffect(() => {

        const initSelector = async () => {
            const selector = await setupWalletSelector({
                network: IS_MAINNET ? 'mainnet' : 'testnet',
                modules: [
                    setupNearWallet(),
                    setupMyNearWallet(),
                    setupSender(),
                    setupHereWallet(),
                    setupMathWallet(),
                    setupNightly(),
                    setupMeteorWallet(),
                    setupWelldoneWallet(),
                    setupLedger(),
                    setupNearFi(),
                    setupCoin98Wallet(),
                    setupOptoWallet()
                ],
            });

            setWalletSelectorModal(setupModal(selector, {
                contractId: 'dontcare'
            }));
        };

        initSelector();

    }, []);

    return (
        <>
            {
                showModal && (
                    <MoreNearWalletsModal
                        open={showModal}
                        onClose={() => setShowModal(null)}
                        onClickSeeMoreWallets={() => setShowModal('wallet-selector')}
                    />
                )
            }
        </>
    );
};
