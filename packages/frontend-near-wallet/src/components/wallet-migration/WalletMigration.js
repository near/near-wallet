import React from 'react';
import { useSelector } from 'react-redux';

import { selectAvailableAccounts } from '../../redux/slices/availableAccounts/index.js';
import { getMyNearWalletUrl } from '../../utils/getWalletURL.js';
import { generateMigrationPin, getExportQueryFromAccounts } from '../../utils/migration.js';
import MigrationPrompt from './MigrationPrompt';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
};

const WalletMigration = () => {
    const initialState = {
        activeView: WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT,
        walletType: 'my-near-wallet',
        migrationPin: generateMigrationPin()
    };

    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWalletType = (walletType) => {
        handleStateUpdate({walletType});
    };

    const handleSetActiveView = (activeView) => {
        handleStateUpdate({activeView});
    };

    const handleCloseMigrationFlow = ()=>{
        // setShowMigrationModal(false);
    };


    const handleRedirectToBatchImport = () => {
        const query = getExportQueryFromAccounts(availableAccounts);
        const baseUrl = getMyNearWalletUrl();
        window.location.href = `${baseUrl}/batch-import#${query}`;
    };

  return (
    <div>
       {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&  
            <MigrationPrompt 
                onClose={handleCloseMigrationFlow}
                handleSetActiveView={handleSetActiveView}
                handleRedirectToBatchImport={handleRedirectToBatchImport}
            />
       }

        {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&  
            <SelectDestinationWallet
                walletType={state.walletType}
                onClose={handleCloseMigrationFlow}
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
                handleRedirectToBatchImport={handleRedirectToBatchImport}
            />
       }
    </div>
  );
};

export default WalletMigration;
