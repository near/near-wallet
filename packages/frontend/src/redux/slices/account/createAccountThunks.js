import { createAsyncThunk } from '@reduxjs/toolkit';
import { KeyPair } from 'near-api-js';
import { PublicKey } from 'near-api-js/lib/utils';
import { KeyType } from 'near-api-js/lib/utils/key_pair';

import * as Config from '../../../config';
import { actions as ledgerActions } from '../../../redux/slices/ledger';
import sendJson from '../../../tmp_fetch_send_json';
import { setReleaseNotesClosed, getLedgerHDPath, setLedgerHdPath } from '../../../utils/localStorage';
import {
    CONTRACT_CREATE_ACCOUNT_URL,
    FUNDED_ACCOUNT_CREATE_URL,
    IDENTITY_FUNDED_ACCOUNT_CREATE_URL,
    RELEASE_NOTES_MODAL_VERSION,
    wallet,
    setKeyMeta
} from '../../../utils/wallet';
import { WalletError } from '../../../utils/walletError';
import { finishAccountSetup } from '../../actions/account';
import { showCustomAlert } from '../../actions/status';
import { SLICE_NAME } from './';

const {
    signInWithLedger
} = ledgerActions;

const {
    RECAPTCHA_ENTERPRISE_SITE_KEY,
    NETWORK_ID,
    RECAPTCHA_CHALLENGE_API_KEY,
    ACCOUNT_HELPER_URL
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
            await wallet.addLedgerAccountId({ accountId });
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
        await dispatch(addLocalKeyAndFinishSetup({ accountId, recoveryMethod, publicKey })).unwrap();
    }
);

export const createNewAccount = createAsyncThunk(
    `${SLICE_NAME}/createNewAccount`,
    async ({
        accountId,
        fundingOptions,
        recoveryMethod,
        publicKey,
        previousAccountId,
        recaptchaToken
    }, { dispatch }) => {
        await wallet.checkNewAccount(accountId);

        const { fundingContract, fundingKey, fundingAccountId } = fundingOptions || {};
        if (fundingContract && fundingKey) {
            await wallet.createNewAccountLinkdrop(accountId, fundingContract, fundingKey, publicKey);
            await wallet.keyStore.removeKey(NETWORK_ID, fundingContract);
        } else if (fundingAccountId) {
            await wallet.createNewAccountFromAnother(accountId, fundingAccountId, publicKey);
        } else if (RECAPTCHA_CHALLENGE_API_KEY && recaptchaToken) {
            await sendJson('POST', FUNDED_ACCOUNT_CREATE_URL, {
                newAccountId: accountId,
                newAccountPublicKey: publicKey.toString(),
                recaptchaCode: recaptchaToken
            });
        } else {
            await sendJson('POST', CONTRACT_CREATE_ACCOUNT_URL, {
                newAccountId: accountId,
                newAccountPublicKey: publicKey.toString(),
            });
        }

        await wallet.saveAndMakeAccountActive(accountId);
        await dispatch(addLocalKeyAndFinishSetup({ accountId, recoveryMethod, publicKey, previousAccountId })).unwrap();
    }
);

export const createAccountFromImplicit = createAsyncThunk(
    `${SLICE_NAME}/createAccountFromImplicit`,
    async ({
        accountId,
        implicitAccountId,
        recoveryMethod
    }, { dispatch }) => {
        const recoveryKeyPair = await wallet.keyStore.getKey(wallet.connection.networkId, implicitAccountId);
        if (recoveryKeyPair) {
            await wallet.saveAccount(accountId, recoveryKeyPair);
        }
        const publicKey = new PublicKey({ keyType: KeyType.ED25519, data: Buffer.from(implicitAccountId, 'hex') });
        const fundingOptions = { fundingAccountId: implicitAccountId };
        await dispatch(createNewAccount({ accountId, fundingOptions, recoveryMethod, publicKey })).unwrap();
    }
    // TODO: showAlert({ onlyError: true })
);

export const createAccountWithSeedPhrase = createAsyncThunk(
    `${SLICE_NAME}/createAccountWithSeedPhrase`,
    async ({
        accountId,
        recoveryKeyPair,
        fundingOptions = {},
        recaptchaToken
    }, { dispatch }) => {
        const recoveryMethod = 'phrase';
        const previousAccountId = wallet.accountId;
        await wallet.saveAccount(accountId, recoveryKeyPair);
        await dispatch(createNewAccount({ accountId, fundingOptions, recoveryMethod, publicKey: recoveryKeyPair.publicKey, previousAccountId, recaptchaToken })).unwrap();
    }
    // TODO: showAlert()
);

export const createNewAccountWithCurrentActiveAccount = createAsyncThunk(
    `${SLICE_NAME}/createNewAccountWithCurrentActiveAccount`,
    async ({
        newAccountId,
        implicitAccountId,
        newInitialBalance,
        recoveryMethod
    }, { dispatch }) => {
        await wallet.checkNewAccount(newAccountId);
        const newPublicKey = new PublicKey({ keyType: KeyType.ED25519, data: Buffer.from(implicitAccountId, 'hex') });
        const account = await wallet.getAccount(wallet.accountId);
        await wallet.createNewAccountWithNearContract({
            account,
            newAccountId,
            newPublicKey,
            newInitialBalance
        });
        await wallet.saveAndMakeAccountActive(newAccountId);
        await dispatch(addLocalKeyAndFinishSetup({ accountId: newAccountId, recoveryMethod, publicKey: newPublicKey })).unwrap();
    }
);

export const finishSetupImplicitAccount = createAsyncThunk(
    `${SLICE_NAME}/finishSetupImplicitAccount`,
    async ({
        implicitAccountId,
        recoveryMethod
    }, { dispatch }) => {
        const publicKey = new PublicKey({ keyType: KeyType.ED25519, data: Buffer.from(implicitAccountId, 'hex') });
        await wallet.saveAndMakeAccountActive(implicitAccountId);
        await dispatch(addLocalKeyAndFinishSetup({ accountId: implicitAccountId, recoveryMethod, publicKey })).unwrap();
    }
);

export const finishLocalSetupForZeroBalanceAccount = createAsyncThunk(
    `${SLICE_NAME}/finishLocalSetupForZeroBalanceAccount`,
    async ({
        implicitAccountId,
        recoveryMethod
    }, { dispatch }) => {
        try {
            if (recoveryMethod === 'ledger') {
                const ledgerHDPath = getLedgerHDPath(implicitAccountId);
                await dispatch(signInWithLedger({ path: ledgerHDPath })).unwrap();
            } else {
                const account = await wallet.getAccount(implicitAccountId);
                const accessKeys = await account.getAccessKeys();
                const fullAccessKeys = accessKeys.filter((it) => it.access_key?.permission === 'FullAccess');
                if (fullAccessKeys.length === 1) {
                    const newKeyPair = KeyPair.fromRandom('ed25519');
                    const newPublicKey = newKeyPair.publicKey;
                    await wallet.addNewAccessKeyToAccount(implicitAccountId, newPublicKey);
                    await wallet.saveAccount(implicitAccountId, newKeyPair);
                }
            }
        } catch (e) {
            throw new WalletError(e, 'addAccessKeyZeroBalanceAccountSetup.error');
        }

    }
);

export const initiateSetupForZeroBalanceAccountPhrase = createAsyncThunk(
    `${SLICE_NAME}/initiateSetupForZeroBalanceAccountPhrase`,
    async ({
        implicitAccountId,
        recoveryKeyPair
    }, { dispatch }) => {
        try {
            try {
                await sendJson('POST', `${ACCOUNT_HELPER_URL}/account/seedPhraseAdded`, {
                    accountId: implicitAccountId,
                    publicKey: recoveryKeyPair.publicKey.toString()
                });
            } catch (e) {
                if (e.message.includes('ConditionalCheckFailedException')) {
                    console.log(`Public key ${recoveryKeyPair.publicKey.toString()} has previously been added as recovery method to account. Continuing setup...`);
                } else {
                    throw new WalletError(e, 'initiateSetupForZeroBalanceAccountPhrase.error');
                }
            }
            await wallet.importZeroBalanceAccount(implicitAccountId, recoveryKeyPair);
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.initiateZeroBalanceAccount',
                errorMessage: e.message
            }));
        }

    }
);

export const initiateSetupForZeroBalanceAccountLedger = createAsyncThunk(
    `${SLICE_NAME}/initiateSetupForZeroBalanceAccountLedger`,
    async ({
        implicitAccountId,
        ledgerPublicKey,
        ledgerHdPath
    }, { dispatch }) => {
        try {
            try {
                await sendJson('POST', `${ACCOUNT_HELPER_URL}/account/ledgerKeyAdded`, {
                    accountId: implicitAccountId,
                    publicKey: ledgerPublicKey.toString()
                });
            } catch (e) {
                if (e.message.includes('ConditionalCheckFailedException')) {
                    console.log(`Ledger public key ${ledgerPublicKey.toString()} has previously been added as recovery method to account. Continuing setup...`);
                } else {
                    throw new WalletError(e, 'initiateSetupForZeroBalanceAccountLedger.error');
                }
            }
            await setKeyMeta(ledgerPublicKey, { type: 'ledger' });
            setLedgerHdPath({ accountId: implicitAccountId, path: ledgerHdPath });
            await wallet.importZeroBalanceAccount(implicitAccountId);
        } catch (e) {
            dispatch(showCustomAlert({
                success: false,
                messageCodeHeader: 'error',
                messageCode: 'walletErrorCodes.initiateZeroBalanceAccount',
                errorMessage: e.message
            }));
        }

    }
);
