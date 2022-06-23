import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { isWhitelabelTestnet } from '../../config/whitelabel';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import {
    keyToString,
    generateKeyPair,
    encodeAccountsTo
} from '../../utils/encoding';
import { getLedgerHDPath } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import MigrateAccounts from './MigrateAccounts';
import MigrationPrompt from './MigrationPrompt';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet from './SelectDestinationWallet';
import SelectWallet from './SelectWallet';


export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_WALLET: 'SELECT_WALLET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS'
};

const initialState = {
    activeView: null,
    walletType: null,
    migrationKeyPair: generateKeyPair()
};

const encodeAccountsToURL = async (accounts, publicKey) => {
    const accountsData = [];
    for (let i = 0; i < accounts.length; i++) {
        const accountId = accounts[i];
        const keyPair = await wallet.getLocalKeyPair(accountId);
        accountsData.push([
            accountId,
            keyPair.secretKey,
            getLedgerHDPath(accountId),
        ]);
    }

    const hash = encodeAccountsTo(accountsData, publicKey);
    const subdomain = isWhitelabelTestnet() ? 'testnet' : 'app';
    const href = `https://${subdomain}.mynearwallet.com/batch-import#${hash}`;

    return href;
};

const WalletMigration = ({ open, history, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts);

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
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
    }, [availableAccounts]);

    const onContinue = useCallback(async () => {
        const url = await encodeAccountsToURL(
            availableAccounts,
            state.migrationKeyPair.publicKey
        );
        window.open(url, '_blank');
    }, [state.migrationKeyPair, availableAccounts]);

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
                    accounts={availableAccounts}
                    migrationKeyPair={state.migrationKeyPair}
                    onContinue={onContinue}
                    onClose={onClose}
                />
        }
    </div>
  );
};

export default WalletMigration;
