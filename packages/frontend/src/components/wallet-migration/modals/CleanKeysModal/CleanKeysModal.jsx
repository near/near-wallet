import * as nearApi from 'near-api-js';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useImmerReducer } from 'use-immer';

import IconLogout from '../../../../images/wallet-migration/IconLogout';
import { switchAccount } from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { selectAccountId } from '../../../../redux/slices/account';
import WalletClass, { wallet } from '../../../../utils/wallet';
import AccountListImport from '../../../accounts/AccountListImport';
import { IMPORT_STATUS } from '../../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import LoadingDots from '../../../common/loader/LoadingDots';
import { ButtonsContainer, StyledButton, MigrationModal, Container, IconBackground } from '../../CommonComponents';
import { WALLET_MIGRATION_VIEWS } from '../../WalletMigration';
import EnterSecretKey from './EnterSecretKey';

const { KeyPair } = nearApi;
const MINIMUM_ACCOUNT_BALANCE  = 0.00005;

const CleanKeysModal = ({ accounts, handleSetActiveView, onNext, onClose, rotatedKeys }) => {
    // 1. Identify Full Access Keys on all user accounts. Identify if they are sms, email, or unknown keys.
    // 2. Ensure that the newly generated key in the RotateKeysModal is not deleted. 
    // 3. Ensure that the funding account has Threshold * (# of FAKs to be removed) Near present in their account. 
    // 4. Ensure that if an account has a single FAK OR is an Implicit Account with 0 Near, 
    // 5. Create a data structure which stores what keys should be marked for deletion
    // 6. For each account to be cleaned, show a modal where the user puts their FAK.

    const [state, localDispatch] = useImmerReducer(sequentialAccountImportReducer, {
        accounts: []
    });

    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const dispatch = useDispatch();
    const initialAccountIdOnStart = useSelector(selectAccountId);
    const initialAccountId = useRef(initialAccountIdOnStart);
    const [showConfirmSeedphraseModal, setShowConfirmSeedphraseModal] = useState(false);
    const [/*finishingSetupForCurrentAccount*/, setFinishingSetupForCurrentAccount] = useState(false);

    useEffect(() => {
        const rotatedPublicKeys = Object.values(rotatedKeys)
            .map((key) => KeyPair.fromString(`ed25519:${key}`).publicKey.toString());

        const importAccounts = async () => {
            const getAccountDetails = async (accountId) => {
                const keyType = await wallet.getAccountKeyType(accountId);
                const accountBalance = await wallet.getBalance(keyType.accountId);
                const accessKeys = (await wallet.getAccessKeys(accountId))
                    .filter(({ public_key }) => rotatedPublicKeys.some((key) => key === public_key));
                // let enough_balance_to_remove_keys = true;

                // access_keys.forEach((key) => {
                // });

                // if (access_keys * YOCTO_NEAR_TO_REMOVE_LAK < ) {

                // }

                console.log({ accountId, keyType, accountBalance, accessKeys });
                return { accountId, keyType, accountBalance, accessKeys };
            };

            const accountWithDetails = await Promise.all(
                accounts.map(getAccountDetails)
            );
            localDispatch({
                type: ACTIONS.ADD_ACCOUNTS,
                accounts: accountWithDetails.reduce(
                    (acc, { accountId, keyType, accountBalance, accessKeys }) => {
                        if (keyType === WalletClass.KEY_TYPES.FAK && accountBalance.balanceAvailable >= MINIMUM_ACCOUNT_BALANCE) {
                            acc.push({ accountId, status: null, accessKeys });
                        }
                        return acc;
                    },
                    []
                )
            });
            setLoadingAccounts(false);
        };
        setLoadingAccounts(true);
        importAccounts();
    }, [rotatedKeys]);

    const currentAccount = useMemo(
        () =>  state.accounts.find(({ status }) => status === IMPORT_STATUS.PENDING),
        [ state.accounts]
    );
    const currentFailedAccount = useMemo(
        () => state.accounts.find(({ status }) => status === IMPORT_STATUS.FAILED)
            && state.accounts.every(({ status }) => status !== IMPORT_STATUS.PENDING),
        [ state.accounts]
    );
    const batchCleanKeysNotStarted = useMemo(
        () => state.accounts.every(({ status }) => status === null),
        [state.accounts]
    );
    const completedWithSuccess = useMemo(() => {
        return !loadingAccounts
            && state.accounts[state.accounts.length - 1].status !==  IMPORT_STATUS.FAILED
            && state.accounts.every(({ status }) => status === IMPORT_STATUS.SUCCESS || status === IMPORT_STATUS.FAILED);
    } , [state.accounts, loadingAccounts]);

    useEffect(() => {
        if (batchCleanKeysNotStarted) {
            initialAccountId.current = initialAccountIdOnStart;
        }
    },[initialAccountIdOnStart, batchCleanKeysNotStarted]);


    useEffect(() => {
        if (completedWithSuccess) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
        }
    }, [completedWithSuccess]);

    const handleConfirmPassphrase = async ({ seedphrase }) => {
        try {
            // const account = await wallet.getAccount(currentAccount.accountId);

            // check validity of the typed in seed phrase
            localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
            setShowConfirmSeedphraseModal(false);
        } catch (e) {
            localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error'
            }));
            await new Promise((r) => setTimeout(r, 3000));
        } finally {
            dispatch(switchAccount({accountId: initialAccountId.current}));
        }
    };

    const removeKeysForCurrentAccount = async () => {
        dispatch(switchAccount({accountId: currentAccount.accountId}));
        // generateAndSetPhrase();
        await new Promise((r) => setTimeout(r, 1500));
        setShowConfirmSeedphraseModal(true);
    };

    useEffect(() => {
        if (currentAccount) {
            setShowConfirmSeedphraseModal(false);

            removeKeysForCurrentAccount();
        }
    }, [currentAccount]);

    console.log({
        showConfirmSeedphraseModal,
        loadingAccounts,
    });
    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconLogout />
                </IconBackground>
                <h3 className='title'>
                    <Translate id='walletMigration.cleanKeys.title' />
                </h3>
                <p><Translate id='walletMigration.cleanKeys.desc'/></p>


                {showConfirmSeedphraseModal && (
                    <EnterSecretKey
                        onClickContinue={async (seedphrase) => {
                            try {
                                setFinishingSetupForCurrentAccount(true);
                                // checkIfValidSecretKeyEntered()
                                await handleConfirmPassphrase(seedphrase);
                                setShowConfirmSeedphraseModal(false);
                            } finally {
                                setFinishingSetupForCurrentAccount(false);
                            }
                        }}
                        onClickCancel = {async () => {
                            localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                            setShowConfirmSeedphraseModal(false);
                        }}
                    />
                )}

                {!showConfirmSeedphraseModal && loadingAccounts && (
                    <LoadingDots />
                )}

                {!showConfirmSeedphraseModal && !loadingAccounts && (
                    <>
                        <div className="accountsTitle">
                            <Translate id='importAccountWithLink.accountsFound' data={{ count: state.accounts.length }} />
                        </div>
                        <AccountListImport accounts={state.accounts} />

                        <ButtonsContainer vertical>

                            {currentFailedAccount && (
                                <StyledButton
                                    onClick={() => localDispatch({ type: ACTIONS.RESTART_PROCESS_INCLUDING_LAST_FAILED_ACCOUNT })}
                                    data-test-id="cleanKeys.cancel"
                                >
                                    <Translate id={'button.retry'} />
                                </StyledButton>
                            )}
                            <StyledButton
                                onClick={() => {
                                    if (state.accounts[state.accounts.length - 1].status === IMPORT_STATUS.FAILED) {
                                        handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
                                    } else {
                                        localDispatch({
                                            type: currentFailedAccount ? ACTIONS.RESTART_PROCESS_FROM_LAST_FAILED_ACCOUNT : ACTIONS.BEGIN_IMPORT
                                        });
                                    }
                                }}
                                fullWidth
                                disabled={!batchCleanKeysNotStarted && !currentFailedAccount}
                                data-test-id="rotateKeys.continue"
                            >
                                <Translate id='button.continue' />
                            </StyledButton>
                            <StyledButton className='gray-blue' onClick={onClose} fullWidth>
                                <Translate id='button.cancel' />
                            </StyledButton>
                        </ButtonsContainer>
                    </>
                )}

            </Container>
        </MigrationModal>
    );
};

export default CleanKeysModal;
