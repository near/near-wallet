import React, { useCallback } from 'react';

import MigrationPrompt from '../components/MigrationPrompt'
import { getAvailableAccounts, getMyNearWalletUrlFromNEARORG, getLedgerHDPath, getLocalKeyPair } from '../../../utils/migration';
import { encodeAccountsToHash, generatePublicKey, keyToString } from '../../../utils/encoding';

import SelectDestinationWallet from '../components/SelectDestinationWallet';
import { getMyNearWalletUrl, WALLET_MIGRATION_VIEWS } from '../../../utils/constants';
import MigrationSecret from '../components/MigrationSecret';
import MigrateAccounts from '../components/MigrateAccounts';
import { MigrationContainer } from '../../../components/styled/Containers';

const initialState = {
    activeView: WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET,
    walletType: 'my-near-wallet',
    migrationKey: generatePublicKey()
};

const encodeAccountsToURL = async (accounts, publicKey) => {
    const accountsData = [];

    for (let i = 0; i < accounts.length; i++) {
        const accountId = accounts[i];
        const keyPair = await getLocalKeyPair(accountId);
        accountsData.push([accountId, keyPair?.secretKey || '', getLedgerHDPath(accountId)]);
    }

    const hash = encodeAccountsToHash(accountsData, publicKey);
    const href = `${getMyNearWalletUrlFromNEARORG()}/batch-import#${hash}`;

    return href;
};


const WalletMigrationPage = () => {
    const destinationWalletBaseUrl = getMyNearWalletUrl();
    const [state, setState] = React.useState(initialState);
    const availableAccounts = getAvailableAccounts();

    const [showContent, setShowContent] = React.useState(false);

    const handleStateUpdate = (newState) => {
        setState({ ...state, ...newState });
    };

    const onContinue = useCallback(async () => {
        const url = await encodeAccountsToURL(
            availableAccounts,
            state.migrationKey
        );
        window.open(url, '_blank');
    }, [state.migrationKey, availableAccounts]);


    React.useEffect(() => {
        if (availableAccounts.length <= 0) {
            window.location.href = destinationWalletBaseUrl
        } else {
            setShowContent(true)
        }
    }, [])

    return (
        showContent ? <MigrationContainer>
            {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&
                <MigrationPrompt
                    handleTransferMyAccounts={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.MIGRATION_SECRET })}
                    handleUseDifferentWallet={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET })}
                />
            }

            {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&
                <SelectDestinationWallet
                    walletType={state.walletType}
                    handleSetWalletType={(walletType) => handleStateUpdate({ walletType })}
                    handleTransferMyAccounts={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.MIGRATION_SECRET })}
                />
            }
            {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_SECRET &&
                <MigrationSecret
                    handleCancel={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET })}
                    showMigrateAccount={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS })}
                    secretKey={keyToString(initialState.migrationKey)}
                />
            }
            {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS &&
                <MigrateAccounts
                    onClose={() => handleStateUpdate({ activeView: WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET })}
                    onContinue={onContinue}
                />
            }
        </MigrationContainer> : null
    );
};

export default WalletMigrationPage;