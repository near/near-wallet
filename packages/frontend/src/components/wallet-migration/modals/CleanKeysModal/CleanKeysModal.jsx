import * as nearApi from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useImmerReducer } from 'use-immer';

import IconLogout from '../../../../images/wallet-migration/IconLogout';
import { switchAccount } from '../../../../redux/actions/account';
import { selectAccountId } from '../../../../redux/slices/account';
import WalletClass, { wallet } from '../../../../utils/wallet';
import { IMPORT_STATUS } from '../../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import LoadingDots from '../../../common/loader/LoadingDots';
import { MigrationModal, Container, IconBackground } from '../../CommonComponents';
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
    const accessKeys = allAccessKeys
        .filter(({ public_key }) =>
            !publicKeyBlacklist.some((key) => key === public_key)
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

const CleanKeysModal = ({ accounts, handleSetActiveView, onNext, onClose, rotatedKeys }) => {
    const [state, localDispatch] = useImmerReducer(sequentialAccountImportReducer, {
        accounts: []
    });

    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [keysToRemove, setKeysToRemove] = useState({});
    const dispatch = useDispatch();
    const initialAccountIdOnStart = useSelector(selectAccountId);
    const initialAccountId = useRef(initialAccountIdOnStart);
    const [showConfirmCleanupModal, setShowConfirmCleanupModal] = useState(false);
    const [showConfirmSeedphraseModal, setShowConfirmSeedphraseModal] = useState(false);
    const [/*finishingSetupForCurrentAccount*/, setFinishingSetupForCurrentAccount] = useState(false);

    useEffect(() => {
        const rotatedPublicKeys = Object.values(rotatedKeys)
            .map((key) => KeyPair.fromString(`ed25519:${key}`).publicKey.toString());

        const importAccounts = async () => {
            const accountDetails = await Promise.all(
                accounts.map((accountId) => getAccountDetails({
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
            setKeysToRemove(currentAccount.accessKeys.reduce((keys, { publicKey }) => {
                keys[publicKey] = true;
                return keys;
            }, {}));

            removeKeysForCurrentAccount();
        }
    }, [currentAccount]);

    return (
        <MigrationModal>
            <Container>
                <IconBackground>
                    <IconLogout />
                </IconBackground>

                {showConfirmSeedphraseModal && (
                    <ConfirmKeyDeletion
                        accountId={currentAccount.accountId}
                        onClose = {async () => {
                            localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                            setShowConfirmSeedphraseModal(false);
                        }}
                        onNext={() => {
                            try {
                                setFinishingSetupForCurrentAccount(true);
                                localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
                                setShowConfirmSeedphraseModal(false);
                                dispatch(switchAccount({accountId: initialAccountId.current}));
                            } finally {
                                setFinishingSetupForCurrentAccount(false);
                            }
                        }}
                        verifySeedPhrase={async (seedPhrase) => {
                            const { publicKey: seedPhrasePublicKey } = parseSeedPhrase(seedPhrase);
                            if (keysToRemove[seedPhrasePublicKey]) {
                                // don't permit signing with a key that would be removed
                                return false;
                            }

                            return (await wallet.getAccessKeys(currentAccount.accountId))
                                .some(({ access_key, public_key }) =>
                                    access_key.permission === 'FullAccess' && public_key === seedPhrasePublicKey
                                );
                        }}
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
                        selectKey={(publicKey) => setKeysToRemove({
                            ...keysToRemove,
                            [publicKey]: !keysToRemove[publicKey],
                        })}
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
                            if (state.accounts[state.accounts.length - 1].status === IMPORT_STATUS.FAILED) {
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
