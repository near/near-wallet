import React, { useCallback, useState,useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ACCOUNT_ID_SUFFIX } from '../../../../config';
import { selectAvailableAccounts } from '../../../../redux/slices/availableAccounts';
import { keyToString, generatePublicKey, encodeAccountsToHash } from '../../../../utils/encoding';
import { getLedgerHDPath } from '../../../../utils/localStorage';
import { wallet } from '../../../../utils/wallet';
import MigrateAccounts from './MigrateAccounts';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet, { WALLET_OPTIONS } from './SelectDestinationWallet';

export const WALLET_EXPORT_MODAL_VIEWS = {
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',    
};

const MigrateAccountsModal = ({ onClose, handleSetActiveView,  handleSetWallet, state, rotatedKeys, onNext, accountWithDetails }) => {
    const [activeModalView, setActiveModalView] = useState('SELECT_DESTINATION_WALLET');
    const availableAccounts = useSelector(selectAvailableAccounts);
    const [migrationKey, setMigrationKey] = useState(generatePublicKey());
    const hasLedgerAccount = useMemo(() => accountWithDetails.findIndex(({ keyType }) => keyType === 'ledger') > -1, [accountWithDetails.length]);
    const selectedWalletId = state?.wallet?.id;

    const shouldExcludeLedgerAccounts = () => {
        const targetWallet = WALLET_OPTIONS.find((wallet) => wallet.id === selectedWalletId);
        return hasLedgerAccount && !targetWallet?.ledgerSupport;
    };
    const accounts = useMemo(() => {
        return shouldExcludeLedgerAccounts()
            ? accountWithDetails.filter(({ keyType }) => keyType !== 'ledger').map(({ accountId }) => accountId)
            : availableAccounts;
    }, [accountWithDetails.length, availableAccounts.length, selectedWalletId]);


    const getAccountsData = async (accounts) => {
        const accountsData = [];
        for (let i = 0; i < accounts.length; i++) {
            const accountId = accounts[i];
            const rotateKey = rotatedKeys[accountId];
            const keyPair = await wallet.getLocalKeyPair(accountId);
            accountsData.push([
                accountId,
                rotateKey || keyPair?.secretKey || '',
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
    
    const onContinue = useCallback(async () => {
        const url = await encodeAccountsToURL(
            accounts,
            migrationKey,
            state.wallet
        );
        onNext();
        window.open(url, '_blank');
    }, [migrationKey, availableAccounts, wallet]);

    useEffect(()=> {
        setMigrationKey(() => generatePublicKey());
    },[state.wallet]);

    const showMigrationPrompt = useCallback(() => {
        setActiveModalView(WALLET_EXPORT_MODAL_VIEWS.SELECT_DESTINATION_WALLET);
    }, [handleSetActiveView]);

    const showMigrateAccount = useCallback(() => {
        setActiveModalView(WALLET_EXPORT_MODAL_VIEWS.MIGRATE_ACCOUNTS);
    }, [handleSetActiveView]);


    return (
        <>
        {activeModalView === 'SELECT_DESTINATION_WALLET'  && (
            <SelectDestinationWallet
                wallet={state.wallet}
                onClose={onClose}
                handleSetWallet={handleSetWallet}
                handleSetActiveView={setActiveModalView}
                data-test-id="exportWalletModal"
                accountWithDetails={accountWithDetails}
            />
        )}
        {activeModalView === 'MIGRATION_SECRET' && (
            <MigrationSecret
                showMigrationPrompt={showMigrationPrompt}
                showMigrateAccount={showMigrateAccount}
                secretKey={keyToString(migrationKey)}
                data-test-id="rotateKeysModal"
            />
        ) 
        }
        { activeModalView === 'MIGRATE_ACCOUNTS'  && (
            <MigrateAccounts
                accounts={accounts}
                onClose={onClose}
                onContinue={onContinue}
            />
        )}
</>
    );
};


export default MigrateAccountsModal;
