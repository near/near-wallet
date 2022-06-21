import React, { useCallback, useEffect } from 'react';

import { isWhitelabelTestnet } from '../../config/whitelabel';
import { keyToString, encodeMessage, generateKeyPair } from '../../utils/encoding';
import { getLedgerHDPath } from '../../utils/localStorage';
import GenerateMigrationKey from './GenerateMigrationKey';
import MigrateAccounts from './MigrateAccounts';
import MigrationPrompt from './MigrationPrompt';
import SelectDestinationWallet from './SelectDestinationWallet';
import SelectWallet from './SelectWallet';



export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    GENERATE_MIGRATION_KEY: 'GENERATE_MIGRATION_KEY',
    SELECT_WALLET: 'SELECT_WALLET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS'
};

const initialState = {
    activeView: null,
    walletType: null,
    migrationKeyPair: generateKeyPair()
};

const WalletMigration = ({ open, history, onClose }) => {
    const [state, setState] = React.useState(initialState);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWalletType = (walletType) => {
        handleStateUpdate({ walletType });
    };

    const handleSetActiveView = (activeView) => {
        handleStateUpdate({ activeView });
    };

    const handleKeyPair = useCallback((accountId, keyPair) => {
        handleSetActiveView(null);
        const accData = `${accountId}=${keyPair.secretKey}=${getLedgerHDPath(accountId)||''}`;
        const encoded = encodeMessage(accData, state.migrationKeyPair.secretKey);

        const subdomain = isWhitelabelTestnet() ? 'testnet' : 'app';
        location.href = `https://${subdomain}.mynearwallet.com/batch-import#${btoa(encoded)}`;
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
            state.activeView === WALLET_MIGRATION_VIEWS.GENERATE_MIGRATION_KEY &&
                <GenerateMigrationKey
                    handleSetWalletType={handleSetWalletType}
                    handleSetActiveView={handleSetActiveView}
                    migrationPin={state.migrationPin}
                    secretKey={keyToString(initialState.migrationKeyPair.publicKey)}
                />
        }
        {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_WALLET &&  
            <SelectWallet 
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
            />
       }
        {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&  
            <SelectDestinationWallet
                walletType={state.walletType}
                onClose={() => handleSetActiveView(null)}
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
                handleRedirectToBatchImport={() => {}}
            />
        }
        {
            state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS &&
                <MigrateAccounts
                    migrationKeyPair={state.migrationKeyPair}
                    onKeyPair={handleKeyPair}
                />
        }
    </div>
  );
};

export default WalletMigration;
