
import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';


import { NETWORK_ID } from '../../../../config';
import { switchAccount } from '../../../../redux/actions/account';
import { showCustomAlert } from '../../../../redux/actions/status';
import { selectAccountId } from '../../../../redux/slices/account';
import WalletClass, { wallet } from '../../../../utils/wallet';
import AccountListImport from '../../../accounts/AccountListImport';
import { IMPORT_STATUS } from '../../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import FormButton from '../../../common/FormButton';
import LoadingDots from '../../../common/loader/LoadingDots';
import Modal from '../../../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from '../../WalletMigration';
// import CleanupAccountKeys from './CleanupAccountKeys';
import EnterSecretKey from './EnterSecretKey';
// Test cases
// - Ensure that if user leaves the flow and comes back in 
// const YOCTO_NEAR_TO_REMOVE_FAK = .00002;
// const YOCTO_NEAR_TO_REMOVE_LAK = .000002;


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

const ButtonsContainer = styled.div`
    text-align: center;
    width: 100% !important;
    display: flex;
`;

const StyledButton = styled(FormButton)`
    width: calc((100% - 16px) / 2);
    margin: 48px 0 0 !important;

    &:last-child{
        margin-left: 16px !important;
    }
`;

const CleanKeysModal = ({handleSetActiveView, onClose}) => {
    // 1. Identify Full Access Keys on all user accounts. 
    // Identify if they are sms, email, or unknown keys
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
    const [finishingSetupForCurrentAccount, setFinishingSetupForCurrentAccount] = useState(false);

    useEffect(() => {
        const importAccounts = async () => {
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const getAccountDetails = async (accountId) => {
                const keyType = await wallet.getAccountKeyType(accountId);
                const access_keys = await wallet.getAccessKeys(accountId);
                const accountBalance = await wallet.getBalance(keyType.accountId);
                // let enough_balance_to_remove_keys = true;
                
                access_keys.forEach((key)=> {
                    console.log(key, 'access key ');
                });

                // if (access_keys * YOCTO_NEAR_TO_REMOVE_LAK < ) {

                // }
                return { accountId, keyType, accountBalance, access_keys };
            };
            
            const accountWithDetails = await Promise.all(
                accounts.map(getAccountDetails)
            );
            localDispatch({
                type: ACTIONS.ADD_ACCOUNTS,
                accounts: accountWithDetails.reduce(((acc, { accountId, keyType, accountBalance }) => keyType == WalletClass.KEY_TYPES.FAK && accountBalance.balanceAvailable >= MINIMIM_ACCOUNT_BALANCE  ? acc.concat({ accountId, status: null }) : acc), [])
            });
            setLoadingAccounts(false);
        };
        setLoadingAccounts(true);
        importAccounts();
    }, []);

    const currentAccount = useMemo(() =>  state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING), [ state.accounts]);
    const currentFailedAccount = useMemo(() => state.accounts.every((account) => account.status !== IMPORT_STATUS.PENDING) && state.accounts.find((account) => account.status === IMPORT_STATUS.FAILED),[ state.accounts]);

    const batchCleanKeysNotStarted = useMemo(() => state.accounts.every((account) => account.status === null), [state.accounts]);
    const completedWithSuccess = useMemo(() => {
        return !loadingAccounts && (state.accounts.every((account) => account.status === IMPORT_STATUS.SUCCESS || account.status === IMPORT_STATUS.FAILED) && state.accounts[state.accounts.length - 1].status !==  IMPORT_STATUS.FAILED);
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

    const handleConfirmPassphrase = async ({seedphrase}) => {
        try {
            // const account = await wallet.getAccount(currentAccount.accountId);

            // check validaty of the typed in seed phrase
            localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
            setShowConfirmSeedphraseModal(() => false);            
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
        setShowConfirmSeedphraseModal(() => true);
    };

    useEffect(() => {
        if (currentAccount) {
            setShowConfirmSeedphraseModal(false);

            removeKeysForCurrentAccount();
        }
    }, [currentAccount]);

    return (
        <>
           {showConfirmSeedphraseModal ? (
               <Modal
                   modalClass="slim"
                   id='migration-modal'
                   onClose={() => {}}
                   modalSize='lg'
               >
                   <EnterSecretKey
                       onClickContinue={async (seedphrase) => {
                           try {
                               setFinishingSetupForCurrentAccount(true);
                               // checkIfValidSecretKeyEntered()
                               await handleConfirmPassphrase(seedphrase);
                               setShowConfirmSeedphraseModal(() => false);
                           } finally {
                               setFinishingSetupForCurrentAccount(false);
                           }
                       }}
                       onClickCancel = { async () => {
                           localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                           setShowConfirmSeedphraseModal(() => false);
                       }}
                   />
               </Modal>
           )
               : (
                   <Modal
                       modalClass="slim"
                       id='migration-modal'
                       onClose={() => {}}
                       modalSize='md'
                       style={{ maxWidth: '431px' }}
                   >
                       <Container>
                           {loadingAccounts? <LoadingDots /> :
                               (
                        <>
                            <h4 className='title'><Translate id='walletMigration.cleanKeys.title' /></h4>
                            <p><Translate id='walletMigration.cleanKeys.desc'/></p>
                            <div className="accountsTitle">
                                <Translate id='importAccountWithLink.accountsFound' data={{ count: state.accounts.length }} />
                            </div>
                            <AccountListImport accounts={state.accounts} />
                            <ButtonsContainer >
                                <StyledButton className="gray-blue" onClick={onClose}>
                                    <Translate id='button.cancel' />
                                </StyledButton>
                                {currentFailedAccount && (
                                    <StyledButton onClick = { () =>  {
                                        localDispatch({ type:  ACTIONS.RESTART_PROCESS_INCLUDING_LAST_FAILED_ACCOUNT});
                                    }
                                    }
                                    data-test-id="cleanKeys.cancel">
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
                                } disabled={!batchCleanKeysNotStarted && !currentFailedAccount}
                                data-test-id="rotateKeys.continue">
                                    <Translate id={'button.continue'} />
                                </StyledButton>
                            </ButtonsContainer>
                        </>
                               )
                           }
                       </Container>
                   </Modal>
               )}
        </>
    );
};
// Ensure the user has the new FAK in their local storage and onchain and that they have exported their account. 

// Delete the old FAK on-chain and then from local storage.

export default CleanKeysModal;
