import * as nearApi from 'near-api-js';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImmerReducer } from 'use-immer';

import IconSecurityLock from '../../../../images/wallet-migration/IconSecurityLock';
import { switchAccount } from '../../../../redux/actions/account';
import { selectAccountId } from '../../../../redux/slices/account';
import WalletClass, { wallet } from '../../../../utils/wallet';
import { IMPORT_STATUS } from '../../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import LoadingDots from '../../../common/loader/LoadingDots';
import { MigrationModal, Container, IconBackground } from '../../CommonComponents';
import { recordWalletMigrationEvent } from '../../metrics';
import { WALLET_MIGRATION_VIEWS } from '../../WalletMigration';
import AccessKeyList from './AccessKeyList';
import AccountKeyCleanup from './AccountKeyCleanup';
import ConfirmKeyDeletion from './ConfirmKeyDeletion';

const { KeyPair } = nearApi;
const MINIMUM_ACCOUNT_BALANCE  = 0.00005;

async function getAccountDetails({ accountId, publicKeyBlacklist, wallet }) {
    const keyType = await wallet.getAccountKeyType(accountId);
    const accountBalance = await wallet.getBalance(keyType.accountId);

    const recoveryMethods = (await wallet.getRecoveryMethods())
        .reduce((keys, { kind, publicKey }) => {
            if (publicKey) {
                keys[publicKey] = kind;
            }

            return keys;
        }, {});

    const allAccessKeys = await wallet.getAccessKeys(accountId);
    const signingPublicKey = await wallet.getPublicKey(accountId);
    
    const accessKeys = allAccessKeys
        .filter(({ public_key }) =>
            !publicKeyBlacklist.some((key) => key === public_key)
            && public_key !== signingPublicKey.toString()
            && recoveryMethods[public_key] !== 'ledger'
        )
        .map(({ public_key }) => ({
            publicKey: public_key,
            kind: recoveryMethods[public_key] || 'unknown',
        }));

    return {
        accessKeys,
        accountBalance,
        accountId,
        keyType,
        totalAccessKeys: allAccessKeys.length,
    };
}

async function deleteKeys({ accountId, publicKeysToDelete, wallet }) {
    const account = await wallet.getAccount(accountId);
    const signingPublicKey = await wallet.getPublicKey(accountId);
    const deleteSigningKey = publicKeysToDelete.some((publicKey) => publicKey === signingPublicKey);
    const keysForBatchDeletion = publicKeysToDelete.length - (deleteSigningKey ? 1 : 0);

    let deleted = 0;
    while (deleted <= keysForBatchDeletion) {
        const upperBound = deleted + 100;
        const deleteBatch = publicKeysToDelete
            .filter((publicKey) => publicKey !== signingPublicKey)
            .slice(deleted, upperBound);
        await account.signAndSendTransaction({
            actions: deleteBatch
                .map((publicKey) => nearApi.transactions.deleteKey(nearApi.utils.PublicKey.fromString(publicKey))),
            receiverId: accountId,
        });

        deleted = upperBound;
    }

    if (deleteSigningKey) {
        await account.deleteKey(signingPublicKey);
        await wallet.keyStore.removeKey(wallet.connection.networkId, accountId);
    }
}

const CleanKeysModal = ({ accounts, handleSetActiveView, onNext, onClose, rotatedKeys }) => {
    const [state, localDispatch] = useImmerReducer(sequentialAccountImportReducer, {
        accounts: []
    });

    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [keysToRemove, setKeysToRemove] = useState([]);
    const [keysAreDeleting, setKeysAreDeleting] = useState(false);
    const dispatch = useDispatch();
    const initialAccountIdOnStart = useSelector(selectAccountId);
    const initialAccountId = useRef(initialAccountIdOnStart);
    const [showConfirmCleanupModal, setShowConfirmCleanupModal] = useState(false);
    const [showConfirmSeedphraseModal, setShowConfirmSeedphraseModal] = useState(false);

    const rotatedPublicKeys = useMemo(
        () => Object.values(rotatedKeys)
            .map((key) => KeyPair.fromString(`ed25519:${key}`).publicKey.toString()),
        [rotatedKeys]
    );

    useEffect(() => {
        const importAccounts = async () => {
            const accountDetails = await Promise.all(
                accounts.map(({ accountId }) => getAccountDetails({
                    accountId,
                    publicKeyBlacklist: rotatedPublicKeys,
                    wallet,
                }))
            );

            localDispatch({
                type: ACTIONS.ADD_ACCOUNTS,
                accounts: accountDetails.reduce(
                    (acc, account) => {
                        const { keyType, accountBalance: { balanceAvailable } } = account;
                        if (keyType === WalletClass.KEY_TYPES.FAK && balanceAvailable >= MINIMUM_ACCOUNT_BALANCE) {
                            acc.push({ ...account, status: account.accessKeys.length ? null : IMPORT_STATUS.SUCCESS });
                        }

                        return acc;
                    },
                    []
                ),
            });
            setLoadingAccounts(false);
        };
        setLoadingAccounts(true);
        importAccounts();
    }, [rotatedKeys]);

    const currentAccount = useMemo(
        () =>  state.accounts.find(({ status }) => status === IMPORT_STATUS.PENDING),
        [state.accounts]
    );
    const currentFailedAccount = useMemo(
        () => state.accounts.find(({ status }) => status === IMPORT_STATUS.FAILED)
            && state.accounts.every(({ status }) => status !== IMPORT_STATUS.PENDING),
        [state.accounts]
    );
    const batchCleanKeysNotStarted = useMemo(
        () => state.accounts.every(({ status }) => status === null),
        [state.accounts]
    );
    const completedWithSuccess = useMemo(() => {
        return !loadingAccounts
            && state.accounts.length
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
            onNext();
        }
    }, [completedWithSuccess]);

    const removeKeysForCurrentAccount = async () => {
        dispatch(switchAccount({ accountId: currentAccount.accountId }));
        await new Promise((r) => setTimeout(r, 1500));
        setShowConfirmCleanupModal(true);
    };

    useEffect(() => {
        if (currentAccount) {
            setShowConfirmCleanupModal(false);
            setKeysToRemove(currentAccount.accessKeys.map(({ publicKey }) => publicKey));

            removeKeysForCurrentAccount();
        }
    }, [currentAccount]);

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconSecurityLock />
                </IconBackground>

                {showConfirmSeedphraseModal && (
                    <ConfirmKeyDeletion
                        accountId={currentAccount.accountId}
                        fakPublicKeys={currentAccount.accessKeys}
                        isDeleting={keysAreDeleting}
                        onClose = {async () => {
                            localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                            setShowConfirmSeedphraseModal(false);
                        }}
                        onNext={async () => {
                            setKeysAreDeleting(true);
                            try {
                                await deleteKeys({
                                    accountId: currentAccount.accountId,
                                    publicKeysToDelete: keysToRemove,
                                    wallet,
                                });
                            } finally {
                                setKeysAreDeleting(false);
                                recordWalletMigrationEvent(`${WALLET_MIGRATION_VIEWS.CLEAN_KEYS} COMPLETED`, {
                                    numberOfFAKDeleted: keysToRemove.length,
                                    accountId: currentAccount.accountId,
                                });
                            }
                            setShowConfirmSeedphraseModal(false);
                            localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
                            dispatch(switchAccount({accountId: initialAccountId.current}));
                        }}
                        publicKeysToDelete={keysToRemove}
                        rotatedPublicKeys={rotatedPublicKeys}
                    />
                )}

                {showConfirmCleanupModal && (
                    <AccessKeyList
                        account={currentAccount}
                        onClose={() => setShowConfirmCleanupModal(false)}
                        onNext={() => {
                            setShowConfirmCleanupModal(false);
                            setShowConfirmSeedphraseModal(true);
                        }}
                        selectKey={(publicKey, checked) => setKeysToRemove(
                            checked
                                ? [...keysToRemove, publicKey]
                                : keysToRemove.filter((key) => key !== publicKey))
                        }
                        selectedKeys={keysToRemove}
                    />
                )}

                {!showConfirmSeedphraseModal && loadingAccounts && (
                    <LoadingDots />
                )}

                {!showConfirmSeedphraseModal && !loadingAccounts && !showConfirmCleanupModal && (
                    <AccountKeyCleanup
                        accounts={state.accounts}
                        batchStarted={!batchCleanKeysNotStarted}
                        offerRetry={currentFailedAccount}
                        onClose={onClose}
                        onNext={() => {
                            if (state.accounts.length && state.accounts[state.accounts.length - 1].status === IMPORT_STATUS.FAILED) {
                                handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
                            } else {
                                localDispatch({
                                    type: currentFailedAccount ? ACTIONS.RESTART_PROCESS_FROM_LAST_FAILED_ACCOUNT : ACTIONS.BEGIN_IMPORT
                                });
                            }
                        }}
                        onRetry={() => localDispatch({ type: ACTIONS.RESTART_PROCESS_INCLUDING_LAST_FAILED_ACCOUNT })}
                    />
                )}
            </Container>
        </MigrationModal>
    );
};

export default CleanKeysModal;
