import React from 'react';
import MigrationPrompt from '../components/MigrationPrompt'
import { getAvailableAccounts, getExportQueryFromAccounts } from '../../../utils/migration';
import SelectDestinationWallet from '../components/SelectDestinationWallet';
import { getMyNearWalletUrl, WALLET_MIGRATION_VIEWS } from '../../../utils/constants';

const WalletMigrationPage = () => {
    const destinationWalletBaseUrl = getMyNearWalletUrl();
    const [walletType, setWalletType] = React.useState('my-near-wallet');
    const [activeView, setActiveView] = React.useState(WALLET_MIGRATION_VIEWS.MIGRATION_PROMPT);
    const [showContent, setShowContent] = React.useState(false);

    const handleRedirectToBatchImport = () => {
        const query = getExportQueryFromAccounts();
        window.location.href = `${destinationWalletBaseUrl}/batch-import#${query}`;
    };

    React.useEffect(() => {
        const accounts = getAvailableAccounts();
        if (accounts.length <= 0) {
            window.location.href = destinationWalletBaseUrl
        } else {
            setShowContent(true)
        }
    }, [])


    if (!showContent) {
        return null
    }

    return (
        showContent ? <div>
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
        </div> : null
    );
};

export default WalletMigrationPage;