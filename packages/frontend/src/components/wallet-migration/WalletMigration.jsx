import React, { useCallback, useEffect } from 'react';

import Disable2FAModal from './modals/Disable2faModal/Disable2FA';
import MigrateAccountsModal from './modals/MigrateAccountsModal/MigrateAccountsModal';
import RotateKeysModal from './modals/RotateKeysModal/RotateKeysModal';

export const WALLET_MIGRATION_VIEWS = {
    DISABLE_2FA: 'DISABLE_2FA',
    ROTATE_KEYS: 'ROTATE_KEYS',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS'
};

const initialState = {
    activeView: null,
    wallet: null,
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = React.useState(initialState);
    const [rotatedKeys, setRotatedKeys] = React.useState({});

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetWallet = (wallet) => {
        handleStateUpdate({ wallet });
    };

    const handleSetActiveView = useCallback((activeView) => {
        handleStateUpdate({ activeView });
    }, [handleStateUpdate]);

  
    useEffect(() => {
        if (open) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.DISABLE_2FA);
        } else {
            handleSetActiveView(null);
        }
    }, [open]);

    const onRotateKeySuccess = useCallback(({ accountId, key }) => {
        setRotatedKeys({
            ...rotatedKeys,
            [accountId]: key,
        });
    }, [Object.keys(rotatedKeys).length]);

    return (
        <div>
            {state.activeView === WALLET_MIGRATION_VIEWS.DISABLE_2FA && (
                <Disable2FAModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="disable2FAModal"
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.ROTATE_KEYS && (
                <RotateKeysModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="rotateKeysModal"
                    onRotateKeySuccess={onRotateKeySuccess}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS && (
                <MigrateAccountsModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                    handleSetWallet={handleSetWallet}
                    state={state}
                    data-test-id="migrateAccountsModal"
                    rotatedKeys={rotatedKeys}
                />
            )}
            
        </div>
    );
};

export default WalletMigration;
