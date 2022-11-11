import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ACCOUNT_ID_SUFFIX } from '../../config';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { encodeAccountsToHash, encrypt, generateKey, generatePublicKey, generateCode, keyToString, generatePinCode } from '../../utils/encoding';
import { getLedgerHDPath } from '../../utils/localStorage';
import { wallet } from '../../utils/wallet';
import Disable2FAModal from './Disable2FA';
import MigrateAccounts from './MigrateAccounts';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet from './SelectDestinationWallet';
import SenderMigrationTypeSelect, { SENDER_MIGRATION_TYPES } from './Sender/MigrationTypeSelect';
import SenderMigrationWithQrCode from './Sender/MigrationWithQrCode';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',
    SENDER_MIGRATION_TYPE_SELECT: 'SENDER_MIGRATION_TYPE_SELECT',
    SENDER_MIGRATION_WITH_QR_CODE: 'SENDER_MIGRATION_WITH_QR_CODE',
    DISABLE_2FA: 'DISABLE_2FA'
};

const initialState = {
    activeView: null,
    wallet: null,
    migrationKey: generatePublicKey()
};

export const getAccountsData = async (accounts) => {
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
    const networkId = ACCOUNT_ID_SUFFIX === 'near' ? 'mainnet' : 'testnet';
    const href = getUrl({ hash, networkId });

    return href;
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const [migrationType, setMigrationType] = React.useState(SENDER_MIGRATION_TYPES.MIGRATE_TO_EXTENSION);
    const [accounts, setAccounts] = React.useState([]);
    const availableAccounts = useSelector(selectAvailableAccounts);

    const pinCode = useMemo(() => {
        if (migrationType === SENDER_MIGRATION_TYPES.MIGRATE_TO_EXTENSION) {
            return generateCode();
        } else {
            return generatePinCode();
        }
    }, [migrationType]);

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

    const migrateToSenderExtension = useCallback(async () => {
        const accountsData = await getAccountsData(accounts);
        const key = await generateKey(pinCode);
        const hash = await encrypt(accountsData, key);
        if (window && window.near) {
            window.near.batchImport({ keystore: hash, network: ACCOUNT_ID_SUFFIX === 'near' ? 'mainnet' : 'testnet' });
        }
    }, [pinCode, accounts]);

    const onContinue = useCallback(async () => {
        switch (state.wallet?.id) {
            case 'sender': {
                if (migrationType === SENDER_MIGRATION_TYPES.MIGRATE_WITH_QR_CODE) {
                    handleSetActiveView(WALLET_MIGRATION_VIEWS.SENDER_MIGRATION_WITH_QR_CODE);
                } else {
                    migrateToSenderExtension();
                }
                break;
            }

            default: {
                let url = '';
                url = await encodeAccountsToURL(
                    availableAccounts,
                    state.migrationKey,
                    state.wallet
                );
                window.open(url, '_blank');
                break;
            }
        }
    }, [state.migrationKey, availableAccounts, state.wallet, migrationType, migrateToSenderExtension]);

    useEffect(() => {
        const filterAccounts = async () => {
            let result = [];
            const accountsData = await getAccountsData(availableAccounts);
            switch (state.wallet?.id) {
                // Ledger no need to migrate to sender, sender can connect ledger directly
                case 'sender': {
                    (accountsData || []).forEach((item) => {
                        if (!item[2]) {
                            result.push(item[0]);
                        }
                    });
                    break;
                }
    
                default: {
                    result = availableAccounts;
                    break;
                }
            }

            setAccounts(result);
        };

        filterAccounts();
    }, [availableAccounts, state.wallet?.id]);

    const secretKey = useMemo(() => {
        let result;
        switch (state.wallet?.id) {
            case 'sender': {
                result = pinCode;
                break;
            }

            default: {
                result = keyToString(initialState.migrationKey);
                break;
            }
        }

        return result;
    }, [initialState.migrationKey, pinCode, state.wallet?.id]);

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
                        secretKey={secretKey}
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
                        accounts={accounts}
                        onContinue={onContinue}
                        onClose={onClose}
                    />
                )}
            {
                state.activeView === WALLET_MIGRATION_VIEWS.SENDER_MIGRATION_TYPE_SELECT && (
                    <SenderMigrationTypeSelect
                        handleMigrationType={setMigrationType}
                        handleSetActiveView={handleSetActiveView}
                        onClose={onClose}
                    />
                )
            }

            {
                state.activeView === WALLET_MIGRATION_VIEWS.SENDER_MIGRATION_WITH_QR_CODE && (
                    <SenderMigrationWithQrCode
                        pinCode={pinCode}
                        accounts={accounts}
                        onClose={onClose}
                        handleSetActiveView={handleSetActiveView}
                    />
                )
            }
        </div>
    );
};

export default WalletMigration;
