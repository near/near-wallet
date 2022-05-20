import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { refreshAccount } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import { selectAccountExists, selectAccountFullAccessKeys, selectAccountId } from '../../../redux/slices/account';
import { finishLocalSetupForZeroBalanceAccount } from '../../../redux/slices/account/createAccountThunks';
import { actions as ledgerActions, selectLedgerConnectionAvailable } from '../../../redux/slices/ledger';
import { wallet } from '../../../utils/wallet';
import { AddLedgerKeyModal } from './AddLedgerKeyModal';


const { handleShowConnectModal } = ledgerActions;

export function ZeroBalanceAccountWrapper() {
    const dispatch = useDispatch();

    const [showAddLedgerKeyModal, setShowAddLedgerKeyModal] = useState(false);
    const [finishingLedgerKeySetup, setFinishingLedgerKeySetup] = useState(false);

    const ledgerConnectionAvailable = useSelector(selectLedgerConnectionAvailable);
    const accountId = useSelector(selectAccountId);
    const accountExists = useSelector(selectAccountExists);
    const accountFullAccessKeys = useSelector(selectAccountFullAccessKeys);

    const isLedgerKey = accountFullAccessKeys[0]?.meta.type === 'ledger';

    useEffect(() => {
        if (accountExists && accountFullAccessKeys.length === 1) {
            if (isLedgerKey) {
                handleCheckLedgerStatus();
            } else {
                handleAddLocalAccessKeyPhrase();
            }
        }
    }, [accountExists]);

    const handleCheckLedgerStatus = async () => {
        const localKey = await wallet.getLocalSecretKey(accountId);
        if (!localKey) {
            setShowAddLedgerKeyModal(true);
        }
    };

    const handleAddLocalAccessKeyLedger = async () => {
        try {
            await dispatch(finishLocalSetupForZeroBalanceAccount({
                implicitAccountId: accountId,
                recoveryMethod: 'ledger',
            }));
            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: 'zeroBalance.addLedgerKey.success.header',
                messageCode: 'zeroBalance.addLedgerKey.success.message'
            }));
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'zeroBalance.addLedgerKey.error.header',
                messageCode: 'zeroBalance.addLedgerKey.error.message',
            }));
        }

        dispatch(refreshAccount());
    };

    const handleAddLocalAccessKeyPhrase = async () => {
        try {
            await dispatch(finishLocalSetupForZeroBalanceAccount({
                implicitAccountId: accountId,
                recoveryMethod: 'phrase',
            }));
            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: 'zeroBalance.addPhraseKey.success.header',
                messageCode: 'zeroBalance.addPhraseKey.success.message'
            }));
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'zeroBalance.addPhraseKey.error.header',
                messageCode: 'zeroBalance.addPhraseKey.error.message',
            }));
        }

        dispatch(refreshAccount());
    };

    if (showAddLedgerKeyModal) {
        return (
            <AddLedgerKeyModal
                isOpen={showAddLedgerKeyModal}
                onClose={() => setShowAddLedgerKeyModal(false)}
                finishingLedgerKeySetup={finishingLedgerKeySetup}
                onClickAddLedgerKey={async () => {
                    if (!ledgerConnectionAvailable) {
                        dispatch(handleShowConnectModal());
                    } else {
                        setFinishingLedgerKeySetup(true);
                        await handleAddLocalAccessKeyLedger();
                        setShowAddLedgerKeyModal(false);
                        setFinishingLedgerKeySetup(false);
                    }
                }}
            />
        );
    }
    return null;
};
