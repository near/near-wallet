import React, { useEffect, useState } from 'react';

import { wallet } from '../../../../utils/wallet';
import { WalletSelectorContent } from './WalletSelectorContent';
import { ExportAccountSelectorContextProvider } from './WalletSelectorExportContext';

export const WalletSelectorModal = ({ onComplete, migrationAccounts, network }) => {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const init = async () => {
            const accountsWithKey = await Promise.all(migrationAccounts.map(async (account) => {
                const localKey = await wallet.getLocalSecretKey(account.accountId);
                return {
                    accountId: account.accountId,
                    privateKey: localKey,
                };
            }));
            setAccounts(accountsWithKey);
        };
        init();
    }, []);

    if (accounts.length === 0) {
        return null;
    }

    return (
        <ExportAccountSelectorContextProvider
            network={network}
            migrationAccounts={accounts}
            onComplete={onComplete}
        >
            <WalletSelectorContent />
        </ExportAccountSelectorContextProvider>
    );

};
