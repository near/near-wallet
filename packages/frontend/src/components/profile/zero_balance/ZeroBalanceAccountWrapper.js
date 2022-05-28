import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { refreshAccount } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import {
    selectAccountExists,
    selectAccountFullAccessKeys,
    selectAccountId,
    selectAccountHas2fa,
    selectActiveAccountIdIsImplicitAccount
} from '../../../redux/slices/account';
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
    const accountHas2fa = useSelector(selectAccountHas2fa);
    const activeAccountIdIsImplicitAccount = useSelector(selectActiveAccountIdIsImplicitAccount);

    const isLedgerKey = accountFullAccessKeys[0]?.meta.type === 'ledger';

    useEffect(() => {
        if (accountExists && activeAccountIdIsImplicitAccount && accountFullAccessKeys.length === 1 && !accountHas2fa) {
            if (isLedgerKey) {
                handleCheckLedgerStatus();
            } else {
                handleAddLocalAccessKey('phrase');
            }
        }
    }, [accountExists, accountHas2fa]);

    const handleCheckLedgerStatus = async () => {
        const localKey = await wallet.getLocalSecretKey(accountId);
        if (!localKey) {
            setShowAddLedgerKeyModal(true);
        }
    };

    const handleAddLocalAccessKey = async (recoveryMethod) => {
        const translationId = recoveryMethod === 'ledger' ? 'addLedgerKey' : 'addPhraseKey';
        
        try {
            await dispatch(finishLocalSetupForZeroBalanceAccount({
                implicitAccountId: accountId,
                recoveryMethod,
            }));
            dispatch(showCustomAlert({
                success: true,
                messageCodeHeader: `zeroBalance.${translationId}.success.header`,
                messageCode: `zeroBalance.${translationId}.success.message`
            }));
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: `zeroBalance.${translationId}.error.header`,
                messageCode: `zeroBalance.${translationId}.error.message`,
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
                        await handleAddLocalAccessKey('ledger');
                        setShowAddLedgerKeyModal(false);
                        setFinishingLedgerKeySetup(false);
                    }
                }}
            />
        );
    }
    return null;
};
