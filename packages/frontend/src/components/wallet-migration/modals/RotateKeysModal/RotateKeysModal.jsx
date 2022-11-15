import { KeyPair } from 'near-api-js';
import { generateSeedPhrase } from 'near-seed-phrase';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';

import { switchAccount } from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { selectAccountId } from '../../../../redux/slices/account';
import WalletClass, { wallet } from '../../../../utils/wallet';
import AccountListImport from '../../../accounts/AccountListImport';
import { IMPORT_STATUS } from '../../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import ConfirmPassphrase from '../../../accounts/recovery_setup/new_account/ConfirmPassphrase';
import SavePassphrase from '../../../accounts/recovery_setup/new_account/SavePassphrase';
import Modal from '../../../common/modal/Modal';
import { ButtonsContainer, StyledButton } from '../../CommonComponents';
import { WALLET_MIGRATION_VIEWS } from '../../WalletMigration';
import ExportKeyModal from './ExportKeyModal';

const Container = styled.div`
    padding: 15px 0;
    text-align: center;
    margin: 0 auto;

    @media (max-width: 360px) {
        padding: 0;
    }

    @media (min-width: 500px) {
        padding: 48px 28px 12px;
    }

    .accountsTitle {
        text-align: left;
        font-size: 12px;
        padding-top: 72px;
        padding-bottom: 6px;
    }

    .title{
        font-weight: 800;
        font-size: 20px;
        margin-top: 40px;
    }
`;
const MINIMIM_ACCOUNT_BALANCE  = 0.00005;

const RotateKeysModal = ({handleSetActiveView, onClose, onRotateKeySuccess, accountWithDetails}) => {
    const [state, localDispatch] = useImmerReducer(sequentialAccountImportReducer, {
        accounts: []
    });
    const [loadingEligibleRotatableAccounts, setLoadingEligibleRotatableAccounts] = useState(true);
    const dispatch = useDispatch();
    const initialAccountIdOnStart = useSelector(selectAccountId);
    const initialAccountId = useRef(initialAccountIdOnStart);

    const [confirmPassphrase, setConfirmPassphrase] = useState(false);
    const [finishingSetupForCurrentAccount, setFinishingSetupForCurrentAccount] = useState(false);
    const [wordIndex, setWordIndex] = useState(null);
    const [userInputValue, setUserInputValue] = useState('');
    const [userInputValueWrongWord, setUserInputValueWrongWord] = useState(false);
    const [currentRecoveryKeyPair, setCurrentRecoveryKeyPair] = useState();
    const [currentPassphrase, setCurrentpassPhrase] = useState('');
    const [showConfirmSeedphraseModal, setShowConfirmSeedphraseModal] = useState(false);
    const [showExportKeyModal, setShowExportKeyModal] = useState(false);

    const generateAndSetPhrase = () => {
        const { seedPhrase, secretKey } = generateSeedPhrase();
        const recoveryKeyPair = KeyPair.fromString(secretKey);

        setCurrentpassPhrase(seedPhrase);
        setCurrentRecoveryKeyPair(recoveryKeyPair);
        setWordIndex(Math.floor(Math.random() * 12));
        return secretKey;
    };

    useEffect(() => {
        const importRotatableAccounts = async () => {
            localDispatch({
                type: ACTIONS.ADD_ACCOUNTS,
                accounts: accountWithDetails.reduce(((acc, { accountId, keyType, accountBalance }) => keyType == WalletClass.KEY_TYPES.FAK && accountBalance.balanceAvailable >= MINIMIM_ACCOUNT_BALANCE  ? acc.concat({ accountId, status: null }) : acc), [])
            });
            setLoadingEligibleRotatableAccounts(false);
            generateAndSetPhrase();
        };
        setLoadingEligibleRotatableAccounts(true);
        importRotatableAccounts();
    }, []);

    const currentAccount = useMemo(() =>  state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING), [ state.accounts]);
    const currentFailedAccount = useMemo(() => state.accounts.every((account) => account.status !== IMPORT_STATUS.PENDING) && state.accounts.find((account) => account.status === IMPORT_STATUS.FAILED),[ state.accounts]);

    const batchKeyRotationNotStarted = useMemo(() => state.accounts.every((account) => account.status === null), [state.accounts]);
    const completedWithSuccess = useMemo(() => {
        return !loadingEligibleRotatableAccounts && (state.accounts.every((account) => account.status === IMPORT_STATUS.SUCCESS || account.status === IMPORT_STATUS.FAILED) && state.accounts[state.accounts.length - 1]?.status !==  IMPORT_STATUS.FAILED);
    } , [state.accounts, loadingEligibleRotatableAccounts]);

    useEffect(() => {
        if (batchKeyRotationNotStarted) {
            initialAccountId.current = initialAccountIdOnStart;
        }
    },[initialAccountIdOnStart, batchKeyRotationNotStarted]);


    useEffect(() => {
        if (completedWithSuccess) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
        }
    }, [completedWithSuccess]);

    const handleConfirmPassphrase = async () => {
        try {
            const account = await wallet.getAccount(currentAccount.accountId);
            await account.addKey(currentRecoveryKeyPair.getPublicKey());
            onRotateKeySuccess({ accountId: currentAccount.accountId,  key: currentRecoveryKeyPair.secretKey});
            setShowConfirmSeedphraseModal(false);  
            setShowExportKeyModal(true);          
        } catch (e) {
            localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error'
            }));
            
            // Persist error for at least 3 seconds
            await new Promise((r) => setTimeout(r, 3000));
        } finally {
            dispatch(switchAccount({accountId: initialAccountId.current}));
        }    
    };

    const rotateKeyForCurrentAccount = async () => {
        dispatch(switchAccount({accountId: currentAccount.accountId}));
        generateAndSetPhrase();
        await new Promise((r) => setTimeout(r, 1500));
        setShowConfirmSeedphraseModal(true);
    };

    useEffect(() => {
        if (currentAccount) {
            setWordIndex(null);
            setUserInputValue('');
            setUserInputValueWrongWord((false));
            setCurrentRecoveryKeyPair(null);
            setCurrentpassPhrase('');
            setShowConfirmSeedphraseModal(false);

            rotateKeyForCurrentAccount();
        }
    }, [currentAccount]);

    if (showExportKeyModal) {
        return (
            <ExportKeyModal
                accountId={currentAccount.accountId}
                secretKey={`ed25519:${currentRecoveryKeyPair.secretKey}`}
                onClose={onClose}
                onContinue={() => {
                    setShowExportKeyModal(false);
                    localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
                }}
            />
        );
    }

    if (confirmPassphrase) {
        return (
            <Modal
                modalClass="slim"
                id='migration-modal'
                onClose={onClose}
                modalSize='md'
                style={{ padding: '0px' }}
            >
                <ConfirmPassphrase
                    wordIndex={wordIndex}
                    userInputValue={userInputValue}
                    userInputValueWrongWord={userInputValueWrongWord}
                    finishingSetup={finishingSetupForCurrentAccount}
                    handleChangeWord={(userInputValue) => {
                        if (userInputValue.match(/[^a-zA-Z]/)) {
                            return false;
                        }
                        setUserInputValue(userInputValue.trim().toLowerCase());
                        setUserInputValueWrongWord(false);
                    }}
                    handleStartOver={() => {
                        generateAndSetPhrase();
                        setConfirmPassphrase(false);
                        setUserInputValue('');
                    }}
                    handleConfirmPassphrase={async () => {
                        try {
                            setFinishingSetupForCurrentAccount(true);
                            if (userInputValue !== currentPassphrase.split(' ')[wordIndex]) {
                                setUserInputValueWrongWord(true);
                                return;
                            }
                            await handleConfirmPassphrase();
                            setConfirmPassphrase(false);
                            setShowConfirmSeedphraseModal(false);
                        } finally {
                            setFinishingSetupForCurrentAccount(false);
                        }
                    }}
                    flat
                />
        
            </Modal>
        );
    }
    return (
        <>
           {showConfirmSeedphraseModal ? (
               <Modal
                   modalClass="slim"
                   id='migration-modal'
                   onClose={onClose}
                   modalSize='lg'
                   style={{ maxWidth: '528px' }}
               >
                   <SavePassphrase
                       passPhrase={currentPassphrase}
                       refreshPhrase={() => {
                           generateAndSetPhrase();
                       }}
                       onClickContinue={() => {
                           setConfirmPassphrase(true);
                       }}
                       onClickCancel = { async () => {
                           localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                           setShowConfirmSeedphraseModal(false);
                       }}
                       accountId={currentAccount.accountId}
                       style={{ marginTop: '0px' }}
                   />
               </Modal>
           )
               : (
                   <Modal
                       modalClass="slim"
                       id='migration-modal'
                       onClose={onClose}
                       modalSize='md'
                       style={{ maxWidth: '431px' }}
                   >
                       <Container>
                           <h4 className='title'><Translate id='walletMigration.rotateKeys.title' /></h4>
                           <p><Translate id='walletMigration.rotateKeys.desc' /></p>
                           <div className="accountsTitle">
                               <Translate id='importAccountWithLink.accountsFound' data={{ count: state.accounts.length }} />
                           </div>

                           <AccountListImport accounts={state.accounts} />
                           <ButtonsContainer vertical={currentFailedAccount}>
                               <StyledButton className="gray-blue" onClick={onClose} fullWidth={currentFailedAccount}>
                                   <Translate id='button.cancel' />
                               </StyledButton>
                               {currentFailedAccount && (
                                   <StyledButton onClick = { () =>  {
                                       localDispatch({ type:  ACTIONS.RESTART_PROCESS_INCLUDING_LAST_FAILED_ACCOUNT});
                                   }
                                   }
                                   data-test-id="rotateKeys.cancel" fullWidth={currentFailedAccount}>
                                       <Translate id={'button.retry'} />
                                   </StyledButton>
                               )}
                               <StyledButton onClick={() => {
                                   if (state.accounts[state.accounts.length - 1].status == IMPORT_STATUS.FAILED) {
                                       handleSetActiveView(WALLET_MIGRATION_VIEWS.MIGRATE_ACCOUNTS);
                                   } else {
                                       localDispatch({ type: currentFailedAccount ? ACTIONS.RESTART_PROCESS_FROM_LAST_FAILED_ACCOUNT : ACTIONS.BEGIN_IMPORT });
                                   }
                               }
                               } disabled={!batchKeyRotationNotStarted && !currentFailedAccount}
                               data-test-id="rotateKeys.continue" fullWidth={currentFailedAccount}>
                                   <Translate id={'button.continue'} />
                               </StyledButton>
                           </ButtonsContainer>
                       </Container>
                   </Modal>
               )}
        </>
    );
};

export default RotateKeysModal;
