import { createAsyncThunk } from '@reduxjs/toolkit';
import { KeyPair } from 'near-api-js';

import * as Config from '../../../config';
import sendJson from '../../../tmp_fetch_send_json';
import { setReleaseNotesClosed } from '../../../utils/localStorage';
import { IDENTITY_FUNDED_ACCOUNT_CREATE_URL, RELEASE_NOTES_MODAL_VERSION, wallet } from '../../../utils/wallet';
import { WalletError } from '../../../utils/walletError';
import { finishAccountSetup } from '../../actions/account';
import { SLICE_NAME } from './';

const {
    RECAPTCHA_ENTERPRISE_SITE_KEY,
} = Config;

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

export const createIdentityFundedAccount = createAsyncThunk(
    `${SLICE_NAME}/createIdentityFundedAccount`,
    async ({
        accountId,
        kind,
        publicKey,
        identityKey,
        verificationCode,
        recoveryMethod,
        recaptchaToken,
        recaptchaAction
    }, { dispatch }) => {
        await wallet.checkNewAccount(accountId);
        await sendJson('POST', IDENTITY_FUNDED_ACCOUNT_CREATE_URL, {
            kind,
            newAccountId: accountId,
            newAccountPublicKey: publicKey.toString(),
            identityKey,
            verificationCode,
            recaptchaToken,
            recaptchaAction,
            recaptchaSiteKey: RECAPTCHA_ENTERPRISE_SITE_KEY
        });
        await wallet.saveAndMakeAccountActive(accountId);
        await dispatch(addLocalKeyAndFinishSetup({ accountId, recoveryMethod, publicKey }));
    }
);
