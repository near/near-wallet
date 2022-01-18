import { createAsyncThunk } from '@reduxjs/toolkit';
import { KeyPair } from 'near-api-js';

import { setReleaseNotesClosed } from '../../../utils/localStorage';
import { RELEASE_NOTES_MODAL_VERSION, wallet } from '../../../utils/wallet';
import { WalletError } from '../../../utils/walletError';
import { finishAccountSetup } from '../../actions/account';
import { SLICE_NAME } from './';

export const addLocalKeyAndFinishSetup = createAsyncThunk(
    `${SLICE_NAME}/addLocalKeyAndFinishSetup`,
    async ({
        accountId,
        recoveryMethod,
        publicKey,
        previousAccountId
    }, { dispatch }) => {
        if (recoveryMethod === 'ledger') {
            await wallet.addLedgerAccountId(accountId);
            await wallet.postSignedJson('/account/ledgerKeyAdded', { accountId, publicKey: publicKey.toString() });
        } else {
            const newKeyPair = KeyPair.fromRandom('ed25519');
            const newPublicKey = newKeyPair.publicKey;
            if (recoveryMethod !== 'phrase') {
                await wallet.addNewAccessKeyToAccount(accountId, newPublicKey);
                await wallet.saveAccount(accountId, newKeyPair);
            } else {
                const contractName = null;
                const fullAccess = true;
                await wallet.postSignedJson('/account/seedPhraseAdded', { accountId, publicKey: publicKey.toString() });
                try {
                    await wallet.addAccessKey(accountId, contractName, newPublicKey, fullAccess);
                    await wallet.saveAccount(accountId, newKeyPair);
                } catch (error) {
                    if (previousAccountId) {
                        await wallet.saveAndMakeAccountActive(previousAccountId);
                    }
                    throw new WalletError(error, 'addAccessKey.error');
                }
            }
        }

        setReleaseNotesClosed(RELEASE_NOTES_MODAL_VERSION);
        await dispatch(finishAccountSetup());
    }
);
