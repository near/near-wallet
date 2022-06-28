import React from 'react';
import MigrationPrompt from './components/MigrationPrompt'

import { useSelector } from 'react-redux';
import { globalStyles } from './styles'


// import { selectAvailableAccounts } from '../../redux/slices/availableAccounts/index.js';
// import { getMyNearWalletUrl } from '../../utils/getWalletURL.js';
// import { generateMigrationPin, getExportQueryFromAccounts } from '../../utils/migration.js';

export const WALLET_MIGRATION_VIEWS = {
    MIGRATION_PROMPT: 'MIGRATION_PROMPT',
    SELECT_DESTINATION_WALLET: 'SELECT_DESTINATION_WALLET',
    GENERATE_MIGRATION_PIN: 'GENERATE_MIGRATION_PIN',
};

const App = () => {
    globalStyles();
    const [walletType, setWalletType] = React.useState('my-near-wallet');
    const [activeView, setActiveView] = React.useState(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);

    // const availableAccounts = useSelector(selectAvailableAccounts);


    const handleRedirectToBatchImport = () => {
        // const query = getExportQueryFromAccounts(availableAccounts);
        // const baseUrl = getMyNearWalletUrl();
        // window.location.href = `${baseUrl}/batch-import#${query}`;
    };

    return (
        <div>
            {activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&
                <MigrationPrompt
                    handleSetActiveView={setActiveView}
                    handleRedirectToBatchImport={handleRedirectToBatchImport}
                />
            }
            {/* 
            {state.activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&
                <SelectDestinationWallet
                    walletType={state.walletType}
                    onClose={handleCloseMigrationFlow}
                    handleSetWalletType={handleSetWalletType}
                    handleSetActiveView={handleSetActiveView}
                    handleRedirectToBatchImport={handleRedirectToBatchImport}
                />
            } */}
        </div>
    );
};

export default App;