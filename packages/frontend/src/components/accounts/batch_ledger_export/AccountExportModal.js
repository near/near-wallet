import BN from 'bn.js';
import { KeyPair, transactions } from 'near-api-js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';

import { actions as ledgerActions, LEDGER_HD_PATH_PREFIX, selectLedgerConnectionAvailable } from '../../../redux/slices/ledger';
import { getEstimatedFees } from '../../../redux/slices/sign';
import { setLedgerHdPath } from '../../../utils/localStorage';
import WalletClass, { wallet } from '../../../utils/wallet';
import FormButton from '../../common/FormButton';
import FormButtonGroup from '../../common/FormButtonGroup';
import Modal from '../../common/modal/Modal';
import SignTransaction from '../../sign/v2/SignTransaction';
import SignTransactionDetails from '../../sign/v2/SignTransactionDetails';
import { HDPathSelect } from '../ledger/LedgerHdPaths';
import { ModalContainer } from './styles';

const { checkAndHideLedgerModal, handleShowConnectModal } = ledgerActions;


const AccountExportModal = ({ account, onSuccess, onFail }) => {
    const [accountBalance, setAccountBalance] = useState(null);
    const [showTxDetails, setShowTxDetails] = useState(false);
    const [addingKey, setAddingKey] = useState(false);
    const [error, setError] = useState(false);
    const [path, setPath] = useState(1);
    const ledgerConnectionAvailable = useSelector(selectLedgerConnectionAvailable);

    const addFAKTransaction = {
        receiverId: account.accountId,
        actions: [transactions.addKey(KeyPair.fromRandom('ed25519').getPublicKey(), transactions.fullAccessKey())]
    };

    const estimatedAddFAKTransactionFees = useMemo(() => addFAKTransaction ? getEstimatedFees([addFAKTransaction]) : new BN('0') ,[addFAKTransaction]);
    const dispatch = useDispatch();
  
    useEffect(() => {
      setAccountBalance(null);
      setShowTxDetails(false);
      setAddingKey(false);
      setError(false);
  
      wallet
          .getBalance(account.accountId)
          .then(({ available }) => setAccountBalance(available));
    },[account]);
  
    const addKeyToWalletKeyStore = useCallback(async () => {
        setAddingKey(true);
        setError(false);

        if (!ledgerConnectionAvailable) {
            setAddingKey(false);
            return dispatch(handleShowConnectModal());
        }
        
        try {
            const ledgerHdPath = `${LEDGER_HD_PATH_PREFIX}${path}'`;
            if (account.keyType === WalletClass.KEY_TYPES.MULTISIG) {
                await wallet.exportToLedgerWallet(ledgerHdPath, account.accountId);
            } else {
                setLedgerHdPath({ accountId: account.accountId, path: ledgerHdPath });
                await wallet.addLedgerAccessKey(ledgerHdPath, account.accountId);
            }
            onSuccess();
        } catch (error) {
            setError(true);
            setAddingKey(false);
        }
        dispatch(checkAndHideLedgerModal());
    }, [onSuccess, account.accountId, ledgerConnectionAvailable]);
  
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
                    <h3 style={{padding: '6px 24px'}}>
                        <Translate id="batchExportAccounts.confirmExportModal.title" />
                    </h3>
                    <HDPathSelect path={path} setPath={setPath} type="export" />
                    <SignTransaction
                        sender={account.accountId}
                        availableBalance={accountBalance}
                        estimatedFees={estimatedAddFAKTransactionFees}
                        fromLabelId="batchExportAccounts.confirmExportModal.accountToExport"
                    />
                    <FormButton className="link" onClick={() => setShowTxDetails(true)}>
                        <Translate id="batchExportAccounts.confirmExportModal.transactionDetails" />
                    </FormButton>
                    {error ? <div className='error-label'><Translate id="reduxActions.default.error" /></div> : null}
                    <FormButtonGroup>
                        <FormButton onClick={onFail} className="gray-blue">
                            <Translate id="button.cancel" />
                        </FormButton>
                        <FormButton
                            onClick={addKeyToWalletKeyStore}
                            disabled={
                                !account.keyType || account.keyType === WalletClass.KEY_TYPES.OTHER || account.keyType === WalletClass.KEY_TYPES.LEDGER
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

  export default AccountExportModal;
