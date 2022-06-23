import { createAsyncThunk } from '@reduxjs/toolkit';

import { SLICE_NAME } from '.';
import { setLedgerHdPath } from '../../../utils/localStorage';
import { getImplicitAccountIdFromSeedPhrase, getKeyPairFromSeedPhrase } from '../../../utils/parseSeedPhrase';
import { wallet, setKeyMeta } from '../../../utils/wallet';
import { getLedgerPublicKey } from '../../actions/account';
import { showCustomAlert } from '../../actions/status';

export const importZeroBalanceAccountLedger = createAsyncThunk(
    `${SLICE_NAME}/importZeroBalanceAccountLedger`,
    async (ledgerHdPath, { dispatch }) => {
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
    }
);

export const importZeroBalanceAccountPhrase = createAsyncThunk(
    `${SLICE_NAME}/importZeroBalanceAccountPhrase`,
    async (seedPhrase, { dispatch }) => {
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
    }
);
