import React from 'react';
import { useSelector } from 'react-redux';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts/index.js';

import { generateMigrationPin, getExportQueryFromAccounts } from '../../utils/migration.js';
import GenerateMigrationPin from './GenerateMigrationPin';
import MigrationPromptModal from './MigrationPromptModal';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_WALLET: 'SELECT_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
};

const WalletMigration = () => {
    const initialState = {
        activeView: WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT,
        walletType: null,
        migrationPin: generateMigrationPin()
    };

    const [state, setState] = React.useState(initialState);
    const availableAccounts = useSelector(selectAvailableAccounts)

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
        handleSetActiveView(null)
    }


    const handleRedirectToBatchImport = () => {
        const query = getExportQueryFromAccounts(availableAccounts)
        localStorage.setItem('MIGRATION_TRIGERRED', true)
        window.location.href = `/batch-import#${query}`
    }


    React.useEffect(() => {
        // Handle if user has not migrated account yet. Maybe set a flag in localstorage on migration triggered
        if (localStorage.getItem('MIGRATION_TRIGERRED')) {
            handleSetActiveView(null);
        }
    }, [])
    

  return (
    <div>
       {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&  
            <MigrationPromptModal 
                onClose={handleCloseMigrationFlow}
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
                handleRedirectToBatchImport={handleRedirectToBatchImport}
            />
       }
        {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&  
            <SelectDestinationWallet 
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
            />
       }

       {state.activeView === WALLET_MIGRATION_VIEWS.GENERATE_MIGRATION_PIN &&  
            <GenerateMigrationPin 
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
                migrationPin={state.migrationPin}
            />
       }
    </div>
  );
};

export default WalletMigration;