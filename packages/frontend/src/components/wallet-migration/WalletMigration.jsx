import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { isWhitelabelTestnet } from '../../config/whitelabel';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { keyToString, encodeMessage, generateKeyPair } from '../../utils/encoding';
import { getLedgerHDPath } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import MigrateAccounts from './MigrateAccounts';
import MigrationPrompt from './MigrationPrompt';
import MigrationSecret from './MigrationSecret';


export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS'
};

const initialState = {
    activeView: null,
    walletType: null,
    migrationKeyPair: generateKeyPair()
};

const redirect = (accountId, keyPair, migrationKeyPair) => {
    const accData = `${accountId}=${keyPair.secretKey}=${getLedgerHDPath(accountId)||''}`;
    const encoded = encodeMessage(accData, migrationKeyPair.secretKey);

    const subdomain = isWhitelabelTestnet() ? 'testnet' : 'app';
    location.href = `https://${subdomain}.mynearwallet.com/batch-import#${btoa(encoded)}`;
    // location.href = `https://localhost:1234/batch-import#${btoa(encoded)}`;
};

const WalletMigration = ({ open, history, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts);
    const sortedAccountsByUsing = [...availableAccounts]
        .sort((a) => a === wallet.accountId ? -1 : 1);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWalletType = (walletType) => {
        handleStateUpdate({ walletType });
    };

    const handleSetActiveView = (activeView) => {
        handleStateUpdate({ activeView });
    };

    const showMigrationPrompt = useCallback(() => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);
    }, []);

    const showMigrateAccount = useCallback(async () => {
        if (availableAccounts.length === 1) {
            const keyPair = await wallet.getLocalKeyPair(wallet.accountId);
            redirect(wallet.accountId, keyPair, state.migrationKeyPair);

            return;
        }

        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
    }, [availableAccounts]);

    const onContinue = useCallback(async (accountId) => {
        handleSetActiveView(null);
        const keyPair = await wallet.getLocalKeyPair(accountId);
        redirect(accountId, keyPair, state.migrationKeyPair);
    }, [state.migrationKeyPair, ]);

    useEffect(() => {
        if (open) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);
        } else {
            handleSetActiveView(null);
        }
    }, [open]);

  return (
    <div>
        {
            state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&
                <MigrationPrompt
                    handleSetWalletType={handleSetWalletType}
                    handleSetActiveView={handleSetActiveView}
                    onClose={onClose}
                />
        }
        {
            state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_SECRET &&
                <MigrationSecret
                    showMigrationPrompt={showMigrationPrompt}
                    showMigrateAccount={showMigrateAccount}
                    migrationPin={state.migrationPin}
                    secretKey={keyToString(initialState.migrationKeyPair.publicKey)}
                />
        }
        {
            state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS &&
                <MigrateAccounts
                    accounts={sortedAccountsByUsing}
                    migrationKeyPair={state.migrationKeyPair}
                    onContinue={onContinue}
                    onClose={onClose}
                />
        }
    </div>
  );
};

export default WalletMigration;
