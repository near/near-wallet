import { current } from '@reduxjs/toolkit';
import { KeyPair } from 'near-api-js';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useImmerReducer } from 'use-immer';

import { NETWORK_ID } from '../../../config';
import { switchAccount } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import { selectAccountId } from '../../../redux/slices/account';
import WalletClass, { wallet } from '../../../utils/wallet';
import AccountListImport from '../../accounts/AccountListImport';
import { IMPORT_STATUS } from '../../accounts/batch_import_accounts';
import sequentialAccountImportReducer, { ACTIONS } from '../../accounts/batch_import_accounts/sequentialAccountImportReducer';
import FormButton from '../../common/FormButton';
import LoadingDots from '../../common/loader/LoadingDots';
import Modal from '../../common/modal/Modal';
import { WALLET_MIGRATION_VIEWS } from '../WalletMigration';

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

const RotateKeysModal = ({handleSetActiveView, onClose}) => {
    const [state, localDispatch] = useImmerReducer(sequentialAccountImportReducer, {
        accounts: []
    });
    const [loadingEligibleRotatableAccounts, setLoadingEligibleRotatableAccounts] = useState(true);
    const [currentFailedAccount, setCurrentFailedAccount] = useState(null);
    const dispatch = useDispatch();
    const initialAccountIdOnStart = useSelector(selectAccountId);
    const initialAccountId = useRef(initialAccountIdOnStart);
    const fail_accounts_idx = [2, 4];
    const [accIdx, setAccIdx] = useState(0);
    useEffect(() => {
        const importRotatableAccounts = async () => {
            // No ledger accounts
            // No Implicit Accounts with 0 balance
            // MINIMIM_ACCOUNT_BALANCE is there
            
            const accounts = await wallet.keyStore.getAccounts(NETWORK_ID);
            const getAccountDetails = async (accountId) => {
                const keyType = await wallet.getAccountKeyType(accountId);
                const accountBalance = await wallet.getBalance(keyType.accountId);
                return { accountId, keyType, accountBalance };
            };
            const accountWithDetails = await Promise.all(
                accounts.map(getAccountDetails)
            );
            localDispatch({
                type: ACTIONS.ADD_ACCOUNTS,
                accounts: accountWithDetails.reduce(((acc, { accountId, keyType, accountBalance }) => keyType == WalletClass.KEY_TYPES.FAK && accountBalance.balanceAvailable >= MINIMIM_ACCOUNT_BALANCE  ? acc.concat({ accountId, status: null }) : acc), [])
            });
            setLoadingEligibleRotatableAccounts(false);
        };
        setLoadingEligibleRotatableAccounts(true);
        importRotatableAccounts();
    }, []);

    // const failed = useMemo(() => state.accounts.some((account) => account.status === IMPORT_STATUS.FAILED), [state.accounts]);
    const currentAccount = useMemo(() =>  state.accounts.find((account) => account.status === IMPORT_STATUS.PENDING), [ state.accounts]);
    const batchKeyRotationNotStarted = useMemo(() => state.accounts.every((account) => account.status === null), [state.accounts]);
    const completedWithSuccess = useMemo(() => {
        console.log('checcking for success ');
        !loadingEligibleRotatableAccounts && state.accounts[state.accounts.length - 1].status === IMPORT_STATUS.SUCCESS;
    } , [state.accounts, loadingEligibleRotatableAccounts]);

    useEffect(() => {
        if (batchKeyRotationNotStarted) {
            initialAccountId.current = initialAccountIdOnStart;
        }
    },[initialAccountIdOnStart, batchKeyRotationNotStarted]);


    useEffect(() => {
        if (completedWithSuccess && !currentFailedAccount) {
            handleSetActiveView(WALLET_MIGRATION_VIEWS.SELECT_DESTINATION_WALLET);
        }
    }, [completedWithSuccess]);
    const rotateKeyForFailedAccount = async (failedAccount) => {
        try {
            dispatch(switchAccount({accountId: failedAccount}));
            const account = await wallet.getAccount(failedAccount);
            const new_FAK = KeyPair.fromRandom('ed25519');
            await account.addKey(new_FAK.getPublicKey());
            await wallet.saveAccount(failedAccount, new_FAK);
            localDispatch({ type: ACTIONS.SET_ACCOUNT_DONE, accountId: failedAccount });
            // dispatch(switchAccount({accountId: initialAccountId.current}));
            setCurrentFailedAccount(null);
        } catch (e) {
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error'
            }));
            await new Promise((r) => setTimeout(r, 3000));
        }
    };
    useEffect(() => {
        const rotateKeyForCurrentAccount = async () => {
            try {
                setCurrentFailedAccount(() => null);
                console.log('current  account' , current.accountId);
                dispatch(switchAccount({accountId: currentAccount.accountId}));
                const account = await wallet.getAccount(currentAccount.accountId);
                setAccIdx((id) => id + 1);
                if (fail_accounts_idx.includes(accIdx)) {
                    throw Error('We have failed!!');
                }
                const new_FAK = KeyPair.fromRandom('ed25519');
                await account.addKey(new_FAK.getPublicKey());
                await wallet.saveAccount(currentAccount.accountId, new_FAK);
                localDispatch({ type: ACTIONS.SET_CURRENT_DONE });
            } catch (e) {
                localDispatch({ type: ACTIONS.SET_CURRENT_FAILED_AND_END_PROCESS });
                setCurrentFailedAccount(currentAccount.accountId);
                dispatch(showCustomAlert({
                    errorMessage: e.message,
                    success: false,
                    messageCodeHeader: 'error'
                }));
                await new Promise((r) => setTimeout(r, 3000));
                // Do not end process, simply skip the failed key and move on!
            } finally {
                dispatch(switchAccount({accountId: initialAccountId.current}));
            }    
        };
        if (currentAccount) {
            rotateKeyForCurrentAccount();
        }
    

    }, [currentAccount]);
    // 1. identify account type (ledger, implicit_account)
    // 2. Identify if user has enough funds to create a key. 
    // 2. Create New FAK 
    // 3. Write Key to local storage of the browser
    // 4. show keyphrase for user to write it
    // 4. Tag new key some how that it is a new key.
    return (
        <>
        <Modal
            modalClass="slim"
            id='migration-modal'
            onClose={() => {}}
            modalSize='md'
            style={{ maxWidth: '435px' }}
        >
            <Container>
                {loadingEligibleRotatableAccounts ? <LoadingDots /> :
                    (
                        <>
                            <h4 className='title'><Translate id='walletMigration.rotateKeys.title' /></h4>
                            <p><Translate id='walletMigration.rotateKeys.desc' /></p>
                            <div className="accountsTitle">
                                <Translate id='importAccountWithLink.accountsFound' data={{ count: state.accounts.length }} />
                            </div>
                            <AccountListImport accounts={state.accounts} />
                            <ButtonsContainer>
                                <StyledButton className="gray-blue" onClick={onClose}>
                                    <Translate id='button.cancel' />
                                </StyledButton>
                                {currentFailedAccount && (
                                    <StyledButton onClick = {() =>  {
                                        rotateKeyForFailedAccount(currentFailedAccount);
                                    }
                                    }>
                                        <Translate id={'button.retry'} />
                                    </StyledButton>
                                )}
                                <StyledButton onClick={() =>
                                    localDispatch({ type: currentFailedAccount ? ACTIONS.RESTART_PROCESS_FROM_LAST_FAILED_ACCOUNT : ACTIONS.BEGIN_IMPORT })
                                } disabled={!currentFailedAccount && !batchKeyRotationNotStarted}>
                                    <Translate id={'button.continue'} />
                                </StyledButton>
                            </ButtonsContainer>
                        </>
                    )
                }
            </Container>
        </Modal>
        </>
    );
};
// Create a new FAK under the user’s account. 
// Ensure that this FAK is written into the local storage of the browser 
// Show this FAK to the user in a modal and have them write out the phrases.
// Before the user batch exports their keys or is able to download the keys, show them a modal that will take them through the process for rotating their keys. 
// Skip rotation of FAK if the account is a ledger account or an implicit account with zero balance. 
// Find out what is the minimum balance the user needs in order to rotate keys. 
// Add a new FAK to local storage and ensure this newly created FAK gets exported. 
// Delete old FAK from local storage and from on-chain.

export default RotateKeysModal;
