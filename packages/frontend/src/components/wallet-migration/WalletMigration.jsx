import React, { useCallback, useEffect, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useSelector, useDispatch } from 'react-redux';

import { NETWORK_ID, IS_MAINNET } from '../../config';
import { showCustomAlert } from '../../redux/actions/status';
import { selectAvailableAccounts } from '../../redux/slices/availableAccounts';
import { MAINNET, TESTNET } from '../../utils/constants';
import { wallet } from '../../utils/wallet';
import LoadingDots from '../common/loader/LoadingDots';
import { MigrationModal, ButtonsContainer, StyledButton, Container } from './CommonComponents';
import { resetUserState, initAnalytics, recordWalletMigrationEvent, recordWalletMigrationState, rudderAnalyticsReady, getAccountIdHash, accountIdToHash, clearAccountIdHash } from './metrics';
import CleanKeysCompleteModal from './modals/CleanKeysCompleteModal/CleanKeyCompleteModal';
import CleanKeysModal from './modals/CleanKeysModal/CleanKeysModal';
import Disable2FAModal from './modals/Disable2faModal/Disable2FA';
import LogoutModal from './modals/LogoutModal/LogoutModal';
import RedirectingModal from './modals/RedirectingModal/RedirectingModal';
import RotateKeysModal from './modals/RotateKeysModal/RotateKeysModal';
import VerifyingModal from './modals/VerifyingModal/VerifyingModal';
import { WalletSelectorModal } from './modals/WalletSelectorModal/WalletSelectorModal';
import { deleteMigrationStep, getAccountDetails, getMigrationStep, setMigrationStep } from './utils';


export const WALLET_MIGRATION_VIEWS = {
    DISABLE_2FA: 'DISABLE_2FA',
    ROTATE_KEYS: 'ROTATE_KEYS',
    MIGRATE_ACCOUNTS: 'MIGRATE_ACCOUNTS',
    REDIRECTING: 'REDIRECTING',
    VERIFYING: 'VERIFYING',
    CLEAN_KEYS: 'CLEAN_KEYS',
    CLEAN_KEYS_COMPLETE: 'CLEAN_KEYS_COMPLETE',
    LOG_OUT: 'LOG_OUT',
};

const initialState = {
    activeView: null,
    wallet: null,
};

const WalletMigration = ({ open, onClose }) => {
    const [state, setState] = useState(initialState);
    const [isQuitModal, setQuitModal] = useState(false);
    const [rotatedKeys, setRotatedKeys] = useState({});
    const availableAccounts = useSelector(selectAvailableAccounts);
    const [loadingMultisigAccounts, setLoadingMultisigAccounts] = useState(true);
    const [accountWithDetails, setAccountWithDetails] = useState([]);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        const importRotatableAccounts = async () => {
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const details = await Promise.allSettled(accounts.map((accountId) => getAccountDetails({ accountId, wallet })))
                .then((results) => results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value));
            setAccountWithDetails(details);
            setLoadingMultisigAccounts(false);
        };
        if (open) {
            initAnalytics().then(() => {
                setLoadingMultisigAccounts(true);
                importRotatableAccounts();
            });
        }
    }, [open]);

    const handleStateUpdate = (newState) => {
        setState({...state, ...newState});
    };

    const handleSetActiveView = useCallback((activeView) => {
        handleStateUpdate({ activeView });
        recordWalletMigrationEvent(activeView);
    }, [handleStateUpdate]);

  
    useEffect(() => {
        if (open) {
            const storedStep = getMigrationStep();
            if (!storedStep && rudderAnalyticsReady) {
                // If there is no stored step, it means the user is starting the migration
                recordWalletMigrationState({ state: 'migration started' });
            }
            handleSetActiveView(storedStep || WALLET_MIGRATION_VIEWS.DISABLE_2FA);
        } else {
            handleSetActiveView(null);
        }
    }, [open, rudderAnalyticsReady]);

    const onRotateKeySuccess = useCallback(({ accountId, key }) => {
        setRotatedKeys({
            ...rotatedKeys,
            [accountId]: key,
        });
    }, [Object.keys(rotatedKeys).length]);

    const navigateToRedirect = ({ accounts, walletName }) => {
        recordWalletMigrationEvent(`${WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS} COMPLETED`, {
            listOfAccounts: accounts.map((accountId) => accountIdToHash(accountId)).join(', '),
            selectedWallet: walletName,
        });
        setMigrationStep(WALLET_MIGRATION_VIEWS.VERIFYING);
        handleSetActiveView(WALLET_MIGRATION_VIEWS.REDIRECTING);
    };

    const navigateToVerifying = () => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.VERIFYING);
        setMigrationStep(WALLET_MIGRATION_VIEWS.VERIFYING);
    };

    const navigateToLogOut = () => {
        recordWalletMigrationEvent(`${WALLET_MIGRATION_VIEWS.VERIFYING} OTHER_WALLET_ACCESS_CHECKED`);
        setMigrationStep(WALLET_MIGRATION_VIEWS.LOG_OUT);
        handleSetActiveView(WALLET_MIGRATION_VIEWS.LOG_OUT);
    };

    const navigateToMigrateAccounts = () => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
    };

    const navigateToCleanKeysComplete = () => {
        handleSetActiveView(WALLET_MIGRATION_VIEWS.CLEAN_KEYS_COMPLETE);
    };

    const onLogout = async () => {
        setIsLoggingOut(true);
        const failedAccounts = [];
        for (const accountId of availableAccounts) {
            const publicKey = await wallet.getPublicKey(accountId);
            try {
                const account = await wallet.getAccount(accountId);
                await account.deleteKey(publicKey);
                await wallet.removeWalletAccount(accountId);
            } catch {
                failedAccounts.push(accountIdToHash(accountId));
            }
        }
        setIsLoggingOut(false);
        if (failedAccounts.length) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                errorMessage: `fail to delete keys for account(s) ${failedAccounts.join(', ')}`,
            }));
        } else {
            const hashId = getAccountIdHash(availableAccounts[0]);
            recordWalletMigrationState({ state: 'migration completed' }, hashId);
            resetUserState();
            onClose();
            deleteMigrationStep();
            clearAccountIdHash(availableAccounts[0]);  
            location.reload();
        }
    };

    const onStartOver = () => {
        recordWalletMigrationEvent(`${WALLET_MIGRATION_VIEWS.VERIFYING} START_OVER`);
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

    // If every account(s) given are invalid, show error message and close modal
    if (open && !loadingMultisigAccounts) {
        if (!accountWithDetails.length) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                errorMessage: 'Unable to fetch required account details for the migration. Make sure there is enough balance in the account(s) and try again.',
            }));
            onClose();
            return null;
        }
    }

    const showQuitModal = () => {
        setQuitModal(true);
    };
    
    const closeQuitModal = () => {
        setQuitModal(false);
    };

    if (isQuitModal) {
        return (
            <MigrationModal>
                <Container>
                    <h3 className='title'>
                        <Translate id='walletMigration.quitMigration.title' />
                    </h3>
                    <p><Translate id='walletMigration.quitMigration.desc' /></p>
                    <ButtonsContainer vertical>
                        <StyledButton
                            onClick={() => {
                                deleteMigrationStep();
                                closeQuitModal();
                                onClose();
                            }}
                            fullWidth
                            disabled={isLoggingOut}
                            sending={isLoggingOut}
                            sendingString="walletMigration.logout.button"
                        >
                            <Translate id='walletMigration.quitMigration.button' />
                        </StyledButton>
                        <StyledButton className='gray-blue' onClick={closeQuitModal} fullWidth>
                            <Translate id='button.cancel' />
                        </StyledButton>
                    </ButtonsContainer>
                </Container>
            </MigrationModal>
        );
    }
    return (
        <div>
            {state.activeView === WALLET_MIGRATION_VIEWS.DISABLE_2FA && (
                <Disable2FAModal
                    onClose={showQuitModal}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="disable2FAModal"
                    accountWithDetails={accountWithDetails}
                    setAccountWithDetails={setAccountWithDetails}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.ROTATE_KEYS && (
                <RotateKeysModal
                    onClose={showQuitModal}
                    handleSetActiveView={handleSetActiveView}
                    data-test-id="rotateKeysModal"
                    onRotateKeySuccess={onRotateKeySuccess}
                    accountWithDetails={accountWithDetails}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.CLEAN_KEYS && (
                <CleanKeysModal
                    accounts={accountWithDetails}
                    handleSetActiveView={handleSetActiveView}
                    onClose={showQuitModal}
                    onNext={navigateToCleanKeysComplete}
                    rotatedKeys={rotatedKeys}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.CLEAN_KEYS_COMPLETE && (
                <CleanKeysCompleteModal onNext={navigateToMigrateAccounts} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS && (
                <WalletSelectorModal
                    onComplete={navigateToRedirect}
                    migrationAccounts={accountWithDetails}
                    network={IS_MAINNET ? MAINNET : TESTNET}
                    rotatedKeys={rotatedKeys}
                />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.REDIRECTING && (
                <RedirectingModal wallet={state?.wallet?.name} onNext={navigateToVerifying} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.VERIFYING && (
                <VerifyingModal onClose={onClose} onNext={navigateToLogOut} onStartOver={onStartOver} />
            )}
            {state.activeView === WALLET_MIGRATION_VIEWS.LOG_OUT && (
                <LogoutModal onClose={onClose} onLogout={onLogout} isLoggingOut={isLoggingOut} />
            )}
        </div>
    );
};

export default WalletMigration;
