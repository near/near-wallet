import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ACCOUNT_ID_SUFFIX } from '../../config';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { encodeAccountsToHash, generatePublicKey, keyToString } from '../../utils/encoding';
import { getMyNearWalletUrlFromNEARORG } from '../../utils/getWalletURL';
import { getLedgerHDPath } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import MigrateAccounts from './MigrateAccounts';
import MigrationPrompt from './MigrationPrompt';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',
};

const initialState = {
    activeView: null,
    walletType: null,
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

const encodeAccountsToSender = async (accounts, publicKey) => {
    const accountsData = await getAccountsData(accounts);
    const hash = encodeAccountsToHash(accountsData, publicKey);
    const network = ACCOUNT_ID_SUFFIX === 'near' ? 'mainnet' : 'testnet';
    const href = `https://sender.org/transfer?keystore=${hash}&network=${network}`;

    return href;
};

const encodeAccountsToURL = async (accounts, publicKey) => {
    const accountsData = await getAccountsData(accounts);
    const hash = encodeAccountsToHash(accountsData, publicKey);
    const href = `${getMyNearWalletUrlFromNEARORG()}/batch-import#${hash}`;

    return href;
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWalletType = (walletType) => {
        handleStateUpdate({ walletType });
    };

    const handleSetActiveView = useCallback((activeView) => {
        handleStateUpdate({ activeView });
    }, [handleStateUpdate]);

    const showMigrationPrompt = useCallback(() => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);
    }, [handleSetActiveView]);

    const showMigrateAccount = useCallback(() => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
    }, [handleSetActiveView]);

    const onContinue = useCallback(async () => {
        let url = '';
        if (state.walletType === 'sender') {
            url = await encodeAccountsToSender(
                availableAccounts,
                state.migrationKey
            );
        } else {
            url = await encodeAccountsToURL(
                availableAccounts,
                state.migrationKey
            );
        }
        window.open(url, '_blank');
    }, [state.migrationKey, availableAccounts, state.walletType]);

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
                state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT && (
                    <MigrationPrompt
                        handleSetActiveView={handleSetActiveView}
                        onClose={onClose}
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
                    walletType={state.walletType}
                    onClose={onClose}
                    handleSetWalletType={handleSetWalletType}
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
