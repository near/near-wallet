import React from 'react';

import { generateMigrationPin } from '../../utils/migration';
import GenerateMigrationPin from './GenerateMigrationPin';
import MigrationPrompt from './MigrationPrompt';
import SelectWallet from './SelectWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_WALLET: 'SELECT_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
};

const WalletMigration = () => {
    const initialState = {
        activeView: null,
        walletType: null,
        migrationPin: generateMigrationPin()
    };
    const [state, setState] = React.useState(initialState);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWalletType = (walletType) => {
        handleStateUpdate({walletType});
    };

    const handleSetActiveView = (activeView) => {
        handleStateUpdate({activeView});
    };

  return (
    <div>
       {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&  
            <MigrationPrompt 
                handleSetWalletType={handleSetWalletType}
                handleSetActiveView={handleSetActiveView}
            />
       }
        {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_WALLET &&  
            <SelectWallet 
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
