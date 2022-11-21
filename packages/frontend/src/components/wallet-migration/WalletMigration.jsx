import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { NETWORK_ID } from '../../config';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { wallet } from '../../utils/wallet';
import LoadingDots from '../common/loader/LoadingDots';
import { MigrationModal } from './CommonComponents';
import CleanKeysModal from './modals/CleanKeysModal/CleanKeysModal';
import Disable2FAModal from './modals/Disable2faModal/Disable2FA';
import LogoutModal from './modals/LogoutModal/LogoutModal';
import MigrateAccountsModal from './modals/MigrateAccountsModal/MigrateAccountsModal';
import RedirectingModal from './modals/RedirectingModal/RedirectingModal';
import RotateKeysModal from './modals/RotateKeysModal/RotateKeysModal';
import VerifyingModal from './modals/VerifyingModal/VerifyingModal';
import { deleteMigrationStep, getAccountDetails, getMigrationStep, setMigrationStep } from './utils';


export const WALLET_MIGRATION_VIEWS = {
    DISABLE_2FA: 'DISABLE_2FA',
    ROTATE_KEYS: 'ROTATE_KEYS',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',
    REDIRECTING: 'REDIRECTING',
    VERIFYING: 'VERIFYING',
    CLEAN_KEYS: 'CLEAN_KEYS',
    LOG_OUT: 'LOG_OUT',
};

const initialState = {
    activeView: null,
    wallet: null,
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = useState(initialState);
    const [rotatedKeys, setRotatedKeys] = useState({});
    const availableAccounts = useSelector(selectAvailableAccounts);
    const [loadingMultisigAccounts, setLoadingMultisigAccounts] = useState(true);
    const [accountWithDetails, setAccountWithDetails] = useState([]);

    useEffect(() => {
        const importRotatableAccounts = async () => {
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const details = await Promise.all(
                accounts.map((accountId) => getAccountDetails({ accountId, wallet }))
            );
            setAccountWithDetails(details);
            setLoadingMultisigAccounts(false);
        };
        if (open) {
            setLoadingMultisigAccounts(true);
            importRotatableAccounts();
        }
    }, [open]);

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
            const storedStep = getMigrationStep();
            handleSetActiveView(storedStep || WALLET_MIGRATION_VIEWS.DISABLE_2FA);
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

    const navigateToRedirect = () => {
        setMigrationStep(WALLET_MIGRATION_VIEWS.VERIFYING);
        handleSetActiveView(WALLET_MIGRATION_VIEWS.REDIRECTING);
    };

    const navigateToVeryfying = () => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.VERIFYING);
    };

    const navigateToCleanKeys = () => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.CLEAN_KEYS);
    };

    const navigateToLogOut = () => {
        setMigrationStep(WALLET_MIGRATION_VIEWS.LOG_OUT);
        handleSetActiveView(WALLET_MIGRATION_VIEWS.LOG_OUT);
    };

    const onLogout = () => {
        // TODO: Add logic to remove FAK(s) here so everything gets cleared together
        return Promise.all(availableAccounts.map((accountId) => wallet.removeWalletAccount(accountId)))
            .then(() => {
                location.reload();
                deleteMigrationStep();
                onClose();
            });
    };

    const onStartOver = () => {
        deleteMigrationStep();
        handleSetActiveView(WALLET_MIGRATION_VIEWS.DISABLE_2FA);
    };

    if (open && loadingMultisigAccounts) {
        return (
            <MigrationModal isOpen disableClose>
                <LoadingDots />
            </MigrationModal>
        );
    }

    return (
        <div>
            {state.activeView === WALLET_MIGRATION_VIEWS.DISABLE_2FA && (
                <Disable2FAModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="disable2FAModal"
                    accountWithDetails={accountWithDetails}
                    setAccountWithDetails={setAccountWithDetails}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.ROTATE_KEYS && (
                <RotateKeysModal
                    onClose={onClose}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="rotateKeysModal"
                    onRotateKeySuccess={onRotateKeySuccess}
                    accountWithDetails={accountWithDetails}
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
                    onNext={navigateToRedirect}
                    accountWithDetails={accountWithDetails}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.REDIRECTING && (
                <RedirectingModal wallet={state?.wallet?.name} onNext={navigateToVeryfying} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.VERIFYING && (
                <VerifyingModal onClose={onClose} onNext={navigateToCleanKeys} onStartOver={onStartOver} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.CLEAN_KEYS && (
                <CleanKeysModal onClose={onClose} onNext={navigateToLogOut} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.LOG_OUT && (
                <LogoutModal onClose={onClose} onLogout={onLogout}/>
            )}
            
        </div>
    );
};

export default WalletMigration;
