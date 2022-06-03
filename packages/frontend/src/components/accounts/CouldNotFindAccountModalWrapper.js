import React from 'react';
import { useDispatch } from 'react-redux';

import {
    redirectTo,
    refreshAccount,
    getLedgerPublicKey
} from '../../redux/actions/account';
import { showCustomAlert, clearGlobalAlert } from '../../redux/actions/status';
import { setLedgerHdPath } from '../../utils/localStorage';
import { getImplicitAccountIdFromSeedPhrase, getKeyPairFromSeedPhrase } from '../../utils/parseSeedPhrase';
import { wallet, setKeyMeta } from '../../utils/wallet';
import { CouldNotFindAccountModal } from './CouldNotFindAccountModal';

export function CouldNotFindAccountModalWrapper({
    isOpen,
    onClose,
    seedPhrase,
    ledgerHdPath,
    recoveryMethod
}) {
    const dispatch = useDispatch();

    const handleImportNonLedgerImplicitAccount = async () => {
        const recoveryKeyPair = getKeyPairFromSeedPhrase(seedPhrase);
        const implicitAccountId = getImplicitAccountIdFromSeedPhrase(seedPhrase);
        try {
            await wallet.importZeroBalanceAccount(implicitAccountId, recoveryKeyPair);
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.recoverAccountSeedPhrase.errorNotAbleToImportAccount',
                errorMessage: e.message
            }));
        }
    };

    const handleImportLedgerImplicitAccount = async () => {
        try {
            const ledgerPublicKey = await dispatch(getLedgerPublicKey(ledgerHdPath));
            const implicitAccountId = Buffer.from(ledgerPublicKey.data).toString('hex');
            const account = wallet.getAccountBasic(implicitAccountId);
            try {
                const accountState = await account.state();
                if (accountState) {
                    const errorMessage = `Implicit account ID ${implicitAccountId} derived from Ledger HD path ${ledgerHdPath} already exists but is not controlled by this Ledger device.`;
                    // This could happen if user creates an implicit account with Ledger but then switches to seed phrase recovery, etc.
                    console.log(errorMessage);
                    dispatch(showCustomAlert({
                        errorMessage: errorMessage,
                        success: false,
                        messageCodeHeader: 'error'
                    }));
                    return;
                }
            } catch (e) {
                if (e.message.includes('does not exist while viewing')) {
                    console.log('Ledger implicit Account ID does not exist on chain. Importing as zero balance account.');
                    await setKeyMeta(ledgerPublicKey, { type: 'ledger' });
                    await setLedgerHdPath({ accountId: implicitAccountId, path: ledgerHdPath });
                    await wallet.importZeroBalanceAccount(implicitAccountId);
                } else {
                    throw e;
                }
            }
        } catch (e) {
            dispatch(showCustomAlert({
                errorMessage: e.message,
                success: false,
                messageCodeHeader: 'error'
            }));
        }
    };

    return (
        <CouldNotFindAccountModal
            isOpen={isOpen}
            onClose={onClose}
            recoveryMethod={recoveryMethod}
            onClickImport={async () => {
                if (recoveryMethod === 'ledger') {
                    await handleImportLedgerImplicitAccount();
                } else {
                    await handleImportNonLedgerImplicitAccount();
                }
                try {
                    await dispatch(refreshAccount());
                } finally {
                    dispatch(redirectTo('/'));
                    dispatch(clearGlobalAlert());
                }
            }}
        />
    );
};

