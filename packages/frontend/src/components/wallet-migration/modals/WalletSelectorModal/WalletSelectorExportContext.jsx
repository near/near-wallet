import { setupExportSelectorModal } from '@near-wallet-selector/account-export';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNightly } from '@near-wallet-selector/nightly';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import '@near-wallet-selector/modal-ui/styles.css';
import '@near-wallet-selector/account-export/styles.css';
import './WalletSelectorModalContext.css';
import { useDispatch } from 'react-redux';

import { showCustomAlert } from '../../../../redux/actions/status';
import { shuffle } from '../../../../utils/staking';

const ExportAccountSelectorContext =
  React.createContext(null);


// If target wallet is production ready, add it to this list
const MAINNET_MODULES = [
    setupNightly,
];

const TESTNET_MODULES = [
    setupMyNearWallet,
    setupMeteorWallet,
    setupNightly,
];

const initializeModules = (network) => {
    const modules = network === 'testnet' ? TESTNET_MODULES : MAINNET_MODULES;
    return shuffle(modules).map((module) => module());
};

export const ExportAccountSelectorContextProvider = ({ children, network, migrationAccounts, onComplete }) => {
    const [importSelector, setSelector] = useState(null);
    const [ExportModal, setModal] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const dispatch = useDispatch();

    const init = useCallback(async () => {
        const selector = await setupWalletSelector({
            allowMultipleSelectors: true,
            network,
            modules: initializeModules(network),
        });
        const modal = setupExportSelectorModal(selector, {
            accounts: migrationAccounts,
            onComplete,
        });
        const state = selector.store.getState();
        setAccounts(state.accounts);

        window.importSelector = selector;
        window.ExportModal = modal;

        setSelector(selector);
        setModal(modal);
    }, []);

    useEffect(() => {
        init().catch((err) => {
            dispatch(showCustomAlert({
                errorMessage: err,
                success: false,
                messageCodeHeader: 'error'
            }));
        });
    }, [init]);

    if (!importSelector) {
        return null;
    }
    const accountId = accounts.find((account) => account.active)?.accountId || null;

    return (
        <ExportAccountSelectorContext.Provider
            value={{
                importSelector,
                ExportModal,
                accounts,
                accountId,
            }}
        >
            {children}
        </ExportAccountSelectorContext.Provider>
    );
};

export function useExportAccountSelector() {
    const context = useContext(ExportAccountSelectorContext);

    if (!context) {
        throw new Error(
            'useExportAccountSelector must be used within a ExportAccountSelectorContextProvider'
        );
    }

    return context;
}
