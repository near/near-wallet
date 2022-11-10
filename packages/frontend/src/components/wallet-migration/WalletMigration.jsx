import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import CONFIG from '../../config';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { encodeAccountsToHash, generatePublicKey, keyToString } from '../../utils/encoding';
import { getLedgerHDPath } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import Disable2FAModal from './Disable2FA';
import MigrateAccounts from './MigrateAccounts';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',
    DISABLE_2FA: 'DISABLE_2FA'
};

const initialState = {
    activeView: null,
    wallet: null,
    migrationKey: generatePublicKey()
};

const getAccountsData = async (accounts) => {
    const accountsData = [];
    for (let i = 0; i < accounts.length; i++) {
        const accountId = accounts[i];
        const keyPair = await wallet.getLocalKeyPair(accountId);
        accountsData.push([
            accountId,
            keyPair?.secretKey || '',
            getLedgerHDPath(accountId),
        ]);
    }

    return accountsData;
};

const encodeAccountsToURL = async (accounts, publicKey, { getUrl }) => {
    const accountsData = await getAccountsData(accounts);
    const hash = encodeAccountsToHash(accountsData, publicKey);
    const networkId = CONFIG.ACCOUNT_ID_SUFFIX === 'near' ? 'mainnet' : 'testnet';
    const href = getUrl({ hash, networkId });

    return href;
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWallet = (wallet) => {
        handleStateUpdate({ wallet });
    };

    const handleSetActiveView = useCallback((activeView) => {
        handleStateUpdate({ activeView });
    }, [handleStateUpdate]);

    const showMigrationPrompt = useCallback(() => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET);
    }, [handleSetActiveView]);

    const showMigrateAccount = useCallback(() => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
    }, [handleSetActiveView]);

    const onContinue = useCallback(async () => {
        let url = '';
        url = await encodeAccountsToURL(
            availableAccounts,
            state.migrationKey,
            state.wallet
        );
        window.open(url, '_blank');
    }, [state.migrationKey, availableAccounts, state.wallet]);

    useEffect(() => {
        if (open) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.DISABLE_2FA);
        } else {
            handleSetActiveView(null);
        }
    }, [open]);

    return (
        <div>
            {state.activeView === WALLET_MIGRATION_VIEWS.DISABLE_2FA && (
                <Disable2FAModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                />
            )}
            {
                state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_SECRET && (
                    <MigrationSecret
                        showMigrationPrompt={showMigrationPrompt}
                        showMigrateAccount={showMigrateAccount}
                        secretKey={keyToString(initialState.migrationKey)}
                    />
                )}
            {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET && (
                <SelectDestinationWallet
                    wallet={state.wallet}
                    onClose={onClose}
                    handleSetWallet={handleSetWallet}
                    handleSetActiveView={handleSetActiveView}
                />
            )}
            {
                state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS && (
                    <MigrateAccounts
                        accounts={availableAccounts}
                        onContinue={onContinue}
                        onClose={onClose}
                    />
                )}
        </div>
    );
};

export default WalletMigration;
