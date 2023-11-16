import React, { useEffect, useState } from 'react';

import { wallet } from '../../../../utils/wallet';
import { WalletSelectorContent } from './WalletSelectorContent';
import { ExportAccountSelectorContextProvider } from './WalletSelectorExportContext';

export const WalletSelectorModal = ({ onComplete, migrationAccounts, network, rotatedKeys }) => {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const init = async () => {
            const accountsWithKey = await Promise.all(migrationAccounts.map(async (account) => {
                const accountId = account.accountId;
                const privateKey = await wallet.getLocalSecretKey(accountId);
                return {
                    accountId,
                    privateKey,
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
