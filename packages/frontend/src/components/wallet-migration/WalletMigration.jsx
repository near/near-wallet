import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { selectAvailableAccounts } from '../../redux/slices/availableAccounts/index.js';
import getWalletURL from '../../utils/getWalletURL.js';
import { generateMigrationPin, getExportQueryFromAccounts } from '../../utils/migration.js';
import GenerateMigrationPin from './GenerateMigrationPin';
import MigrationPromptModal from './MigrationPromptModal';
import SelectDestinationWallet from './SelectDestinationWallet';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
};
const WHITELISTED_ROUTES = ['/batch-import'];

const WalletMigration = () => {
    const location = useLocation();
    const initialState = {
        activeView: null,
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
        handleSetActiveView(null);
    };


    const handleRedirectToBatchImport = () => {
        console.log(availableAccounts);
        const query = getExportQueryFromAccounts(availableAccounts);
        const baseUrl = getWalletURL(true);
        handleCloseMigrationFlow();
        localStorage.setItem('MIGRATION_TRIGERRED', true);
        window.location.href = `${baseUrl}/batch-import#${query}`;
    };


    React.useEffect(() => {
        const isWhitelistedRoute =  WHITELISTED_ROUTES.includes(location.pathname);
        if (isWhitelistedRoute) return;

        if (!localStorage.getItem('MIGRATION_TRIGERRED')) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);
        }
    }, []);
    

  return (
    <div>
       {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&  
            <MigrationPromptModal 
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
