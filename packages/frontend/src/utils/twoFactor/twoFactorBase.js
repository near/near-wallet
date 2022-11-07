import { BN } from 'bn.js';
import * as nearApiJs from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';

import {
    ACCOUNT_HELPER_URL,
    MULTISIG_CONTRACT_HASHES,
    MULTISIG_MIN_AMOUNT,
    NETWORK_ID,
    NODE_URL,
} from '../../config';
import { WalletError } from '../walletError';

const {
    multisig: { Account2FA },
    Connection,
    keyStores: { InMemoryKeyStore },
    KeyPair,
} = nearApiJs;

const LAK_CONVERSION_BATCH_SIZE = 50; // number of LAKs that can be converted (deleted + re-created) in one transaction
const LAK_DISABLE_THRESHOLD = 48; // maximum number of LAKs that can be converted by the `delete` method

export class TwoFactorBase extends Account2FA {
    constructor({
        connection,
        accountId,
        getCode,
        init2fa,
        isLedgerEnabled,
        localStorage,
        refreshAccount,
        has2fa,
    }) {
        super(connection, accountId, {
            storage: localStorage,
            helperUrl: ACCOUNT_HELPER_URL,
            getCode,
        });
        this.has2fa = has2fa;
        this.init2fa = init2fa;
        this.isLedgerEnabled = isLedgerEnabled;
        this.refreshAccount = refreshAccount;
    }

    static async has2faEnabled(account) {
        const state = await account.state();
        if (!state) {
            return false;
        }
        return MULTISIG_CONTRACT_HASHES.includes(state.code_hash);
    }

    static async checkCanEnableTwoFactor(balance) {
        const availableBalance = new BN(balance.available);
        const multisigMinAmount = new BN(nearApiJs.utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT));
        return multisigMinAmount.lt(availableBalance);
    }

    async get2faMethod() {
        if (TwoFactorBase.has2faEnabled(this)) {
            return super.get2faMethod();
        }
        return null;
    }

    async initTwoFactor(accountId, method) {
        // additional check if the ledger is enabled, in case the user was able to omit disabled buttons
        const isLedgerEnabled = await this.isLedgerEnabled();
        if (isLedgerEnabled) {
            throw new WalletError('Ledger Hardware Wallet is enabled', 'initTwoFactor.ledgerEnabled');
        }

        // clear any previous requests in localStorage (for verifyTwoFactor)
        this.setRequest({ requestId: -1 });
        return await this.init2fa({ accountId, method });
    }

    async getMultisigRequest() {
        const { requestId, accountId } = this.getRequest();
        return {
            ...await this.viewFunction(this.accountId, 'get_request', { request_id: requestId }),
            request_id: requestId,
            account_id: accountId,
        };
    }

    async deployMultisig() {
        const contractBytes = new Uint8Array(await (await fetch('/multisig.wasm')).arrayBuffer());
        await super.deployMultisig(contractBytes);
        this.has2fa = true;
    }

    async disableMultisig() {
        const contractBytes = new Uint8Array(await (await fetch('/main.wasm')).arrayBuffer());
        const stateCleanupContractBytes = new Uint8Array(await (await fetch('/state_cleanup.wasm')).arrayBuffer());
        let result;
        try {
            result = await this.disable(contractBytes, stateCleanupContractBytes);
        } catch (e) {
            if (e.message.includes('too large to be viewed')) {
                throw new Error('You must wait 15 minutes between each attempt to disable 2fa. Please try again in 15 minutes.');
            }
            if (e.message.includes('Request was cancelled.')) {
                throw new Error('Request was cancelled. You must wait 15 minutes to attempt disabling 2fa again.');
            }
            throw new Error(e.message);
        }
        await this.refreshAccount();
        this.has2fa = false;
        return result;
    }

    static async disableMultisigWithFAK({ accountId, seedPhrase, cleanupState }) {
        const keyStore = new InMemoryKeyStore();
        await keyStore.setKey(NETWORK_ID, accountId, KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey));
        const connection = Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: {
                type: 'JsonRpcProvider',
                args: { url: NODE_URL },
            },
            signer: { type: 'InMemorySigner', keyStore },
        });

        const emptyContractBytes = new Uint8Array(await (await fetch('/main.wasm')).arrayBuffer());
        let cleanupContractBytes;
        if (cleanupState) {
            cleanupContractBytes = new Uint8Array(await (await fetch('/state_cleanup.wasm')).arrayBuffer());
        }

        const account = new Account2FA(connection, accountId, {
            helperUrl: ACCOUNT_HELPER_URL,
        });

        return await account.disableWithFAK({ contractBytes: emptyContractBytes, cleanupContractBytes });
    }

    /**
     * Returns the list of multisig function call access keys
     */
    async get2faLimitedAccessKeys() {
        return (await this.getAccessKeys())
            .filter(({ access_key }) => {
                if (access_key.permission === 'FullAccess') {
                    return false;
                }

                const perm = access_key.permission.FunctionCall;
                return perm.receiver_id === this.accountId &&
                    perm.method_names.length === 4 &&
                    perm.method_names.includes('add_request_and_confirm');
            });
    }

    /**
     * Returns `false` if multisig cannot be disabled by calling disable() directly
     * i.e. account has too many LAKs to delete and re-create as FAKs for a single transaction
     */
    async isKeyConversionRequiredForDisable() {
        const keys = await this.get2faLimitedAccessKeys();
        return keys.length > LAK_DISABLE_THRESHOLD;
    }

    /**
     * Converts multisig LAKs (excluding the active key in the wallet, provided here as the
     * `signingPublicKey` argument) back to FAKs when there are too many key conversions to be
     * executed within the same transaction.
     *
     * Note that this undermines the security provided by 2FA by converting existing multisig LAKs into FAKs
     * capable of bypassing the 2FA prompt when signing transactions outside the wallet (transactions signed
     * in the wallet will continue to require 2FA approval). This method should only be used to convert LAKs
     * as a way to make 2FA disabling possible.
     *
     * To be deprecated after 2FA migration; this addresses a specific issue with multisig deployed via wallet.
     * @param signingPublicKey the public key used to sign transactions in the wallet
     */
    async batchConvertKeysAndDisable(signingPublicKey) {
        if (!signingPublicKey) {
            throw new Error('the public key used to sign multisig transactions must be provided');
        }

        const { stateStatus } = await this.checkMultisigCodeAndStateStatus();
        if (stateStatus !== 2 && stateStatus !== 1) {
            throw new Error(`Can not deploy a contract to account ${this.accountId} on network ${this.connection.networkId}, the account state could not be verified.`);
        }

        let converted = 0;
        const accessKeys = await this.get2faLimitedAccessKeys();
        const keysToConvert = accessKeys
            .filter(({ public_key }) => public_key !== signingPublicKey);

        while (converted < (accessKeys.length - LAK_DISABLE_THRESHOLD)) {
            const conversionActions = keysToConvert
                .slice(converted, converted + LAK_CONVERSION_BATCH_SIZE)
                .reduce((conversionActions, { public_key }) => {
                    const { addKey, deleteKey, fullAccessKey } = nearApiJs.transactions;
                    conversionActions.push(deleteKey(nearApiJs.utils.PublicKey.from(public_key)));
                    conversionActions.push(addKey(nearApiJs.utils.PublicKey.from(public_key), fullAccessKey()));

                    return conversionActions;
                }, []);

            await this.signAndSendTransaction({
                receiverId: this.accountId,
                actions: conversionActions
            });

            converted += LAK_CONVERSION_BATCH_SIZE;
        }

        return this.disableMultisig();
    }
}
