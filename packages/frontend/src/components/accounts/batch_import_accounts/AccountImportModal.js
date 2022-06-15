import BN from 'bn.js';
import { KeyPair, transactions } from 'near-api-js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import refreshAccountOwner from '../../../redux/sharedThunks/refreshAccountOwner';
import { selectAccountUrlReferrer } from '../../../redux/slices/account';
import { getEstimatedFees } from '../../../redux/slices/sign';
import WalletClass, { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Modal from '../../common/modal/Modal';
import ConnectWithApplication from '../../login/v2/ConnectWithApplication';
import SignTransaction from '../../sign/v2/SignTransaction';
import SignTransactionDetails from '../../sign/v2/SignTransactionDetails';
import { ModalContainer } from './styles';


const AccountImportModal = ({ account, onSuccess, onFail }) => {
    const [keyType, setKeyType] = useState(null);
    const [accountBalance, setAccountBalance] = useState(null);
    const [showTxDetails, setShowTxDetails] = useState(false);
    const [addingKey, setAddingKey] = useState(false);
    const [error, setError] = useState(false);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);
    const addFAKTransaction = useMemo(() => {
      try {
        return {
          receiverId: account.accountId,
          actions: [transactions.addKey(KeyPair.fromString(account.key), transactions.fullAccessKey())]
        };
      } catch (error) {
        return null;
      }
    }, [account]);
    const estimatedAddFAKTransactionFees = useMemo(() => addFAKTransaction ? getEstimatedFees([addFAKTransaction]) : new BN('0') ,[addFAKTransaction]);
    const dispatch = useDispatch();
  
    useEffect(() => {
      setKeyType(null);
      setAccountBalance(null);
      setShowTxDetails(false);
      setAddingKey(false);
      setError(false);
  
      let keyPair;
  
      try {
        keyPair = KeyPair.fromString(account.key).getPublicKey().toString();
      } catch (error) {
        setError(true);
        setKeyType(WalletClass.KEY_TYPES.OTHER);
      }
  
      if (keyPair) {
        wallet
          .getPublicKeyType(
              account.accountId,
              keyPair
          )
          .then(setKeyType).catch(() => {
            setError(true);
            setKeyType(WalletClass.KEY_TYPES.OTHER);
          });
      }
  
      wallet
          .getBalance(account.accountId)
          .then(({ available }) => setAccountBalance(available));
    },[account]);
  
    const addKeyToWalletKeyStore = useCallback(() => {
        setAddingKey(true);
        setError(false);
        let keyPair;
  
        try {
          keyPair = KeyPair.fromString(account.key);
        } catch (error) {
          setError(true);
          setAddingKey(false);
        }
        
        if (keyPair) {
          wallet
            .addExistingAccountKeyToWalletKeyStore(
                account.accountId,
                keyPair,
                account.ledgerHdPath
            )
            .then(() => dispatch(refreshAccountOwner({})))
            .then(onSuccess)
            .catch(() => {
              setError(true);
              setAddingKey(false);
            });
        }
        
    }, [setAddingKey, setError, onSuccess, account]);
  
    return (
        <Modal
            isOpen={account}
            modalSize="md"
            modalClass="slim"
            onClose={() => {}}
            disableClose
        >
            {showTxDetails ? (
                <SignTransactionDetails
                    onClickGoBack={() => setShowTxDetails(false)}
                    transactions={[addFAKTransaction]}
                    signGasFee={estimatedAddFAKTransactionFees.toString()}
                />
            ) : (
                <ModalContainer>
                    <h3>
                        <Translate id="batchImportAccounts.confirmImportModal.title" />
                    </h3>
                    <ConnectWithApplication appReferrer={accountUrlReferrer} />
                    <SignTransaction
                        sender={account.accountId}
                        availableBalance={accountBalance}
                        estimatedFees={keyType === WalletClass.KEY_TYPES.FAK ? estimatedAddFAKTransactionFees : '0'}
                        fromLabelId="batchImportAccounts.confirmImportModal.accountToImport"
                    />
                    {keyType === WalletClass.KEY_TYPES.FAK && (
                        <FormButton className="link" onClick={() => setShowTxDetails(true)}>
                            <Translate id="batchImportAccounts.confirmImportModal.transactionDetails" />
                        </FormButton>
                    )}
                    {error ? <div className='error-label'><Translate id="reduxActions.default.error" /></div> : null}
                    <FormButtonGroup>
                        <FormButton onClick={onFail} className="gray-blue">
                            <Translate id="button.cancel" />
                        </FormButton>
                        <FormButton
                            onClick={addKeyToWalletKeyStore}
                            disabled={
                                !keyType || keyType === WalletClass.KEY_TYPES.OTHER
                            }
                            sending={addingKey}
                        >
                            <Translate id="button.approve" />
                        </FormButton>
                    </FormButtonGroup>
                </ModalContainer>
            )}
        </Modal>
    );
  };

  export default AccountImportModal;
