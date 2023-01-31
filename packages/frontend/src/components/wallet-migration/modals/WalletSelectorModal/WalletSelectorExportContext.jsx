
import { setupExportSelectorModal } from '@near-wallet-selector/account-export';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import '@near-wallet-selector/modal-ui/styles.css';
import '@near-wallet-selector/account-export/styles.css';
import './WalletSelectorModalContext.css';

const ExportAccountSelectorContext =
  React.createContext(null);

export const ExportAccountSelectorContextProvider = ({ children, network, migrationAccounts, onComplete }) => {
    const [importSelector, setSelector] = useState(null);
    const [ExportModal, setModal] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const init = useCallback(async () => {
        const _selector = await setupWalletSelector({
            allowMultipleSelectors: true,
            network,
            modules: [
                setupMyNearWallet(),
                setupMeteorWallet(),
            ],
        });
        const _modal = setupExportSelectorModal(_selector, {
            accounts: migrationAccounts,
            onComplete,
        });
        const state = _selector.store.getState();
        setAccounts(state.accounts);

        window.importSelector = _selector;
        window.ExportModal = _modal;

        setSelector(_selector);
        setModal(_modal);
    }, []);

    useEffect(() => {
        init().catch((err) => {
            console.error(err);
            alert('Failed to initialise wallet selector');
        });
    }, [init]);

    useEffect(() => {
        if (!importSelector) {
            return;
        }
    }, [importSelector]);

    const accountId =
    accounts.find((account) => account.active)?.accountId || null;

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
