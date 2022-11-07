import React, { useCallback, useState,useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ACCOUNT_ID_SUFFIX } from '../../../../config';
import { selectAvailableAccounts } from '../../../../redux/slices/availableAccounts';
import { keyToString, generatePublicKey, encodeAccountsToHash } from '../../../../utils/encoding';
import { getLedgerHDPath } from '../../../../utils/localStorage';
import { wallet } from '../../../../utils/wallet';
import MigrateAccounts from './MigrateAccounts';
import MigrationSecret from './MigrationSecret';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_EXPORT_MODAL_VIEWS = {
    MIGRATION_SECRET: 'MIGRATION_SECRET',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',    
};

const MigrateAccountsModal = ({ onClose, handleSetActiveView,  handleSetWallet, state, rotatedKeys, onNext }) => {
    const [activeModalView, setActiveModalView] = useState('SELECT_DESTINATION_WALLET');
    const availableAccounts = useSelector(selectAvailableAccounts);
    const [migrationKey, setMigrationKey] = useState(generatePublicKey());

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
        let url = '';
        url = await encodeAccountsToURL(
            availableAccounts,
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
                accounts={availableAccounts}
                onClose={onClose}
                onContinue={onContinue}
            />
        )}
</>
    );
};


export default MigrateAccountsModal;
