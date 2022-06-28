import React from 'react';
import MigrationPrompt from './components/MigrationPrompt'
import { globalStyles } from './styles'
import { getExportQueryFromAccounts } from './utils/migration';
import SelectDestinationWallet from './components/SelectDestinationWallet';
import { WALLET_MIGRATION_VIEWS } from './utils/constants';


// import { selectAvailableAccounts } from '../../redux/slices/availableAccounts/index.js';
// import { getMyNearWalletUrl } from '../../utils/getWalletURL.js';
// import { generateMigrationPin, getExportQueryFromAccounts } from '../../utils/migration.js'

const App = () => {
    globalStyles();
    const [walletType, setWalletType] = React.useState('my-near-wallet');
    const [activeView, setActiveView] = React.useState(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);

    // const availableAccounts = useSelector(selectAvailableAccounts);


    const handleRedirectToBatchImport = () => {
        const query = getExportQueryFromAccounts();
        const baseUrl = 'https://testnet.mynearwallet.com';
        window.location.href = `${baseUrl}/batch-import#${query}`;
    };

    return (
        <div>
            {activeView === WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT &&
                <MigrationPrompt
                    handleSetActiveView={setActiveView}
                    handleRedirectToBatchImport={handleRedirectToBatchImport}
                />
            }

            {activeView === WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET &&
                <SelectDestinationWallet
                    walletType={walletType}
                    handleSetWalletType={setWalletType}
                    handleSetActiveView={setActiveView}
                    handleRedirectToBatchImport={handleRedirectToBatchImport}
                />
            }
        </div>
    );
};

export default App;