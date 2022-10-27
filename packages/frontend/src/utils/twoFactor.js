import { BN } from 'bn.js';
import * as nearApiJs from 'near-api-js';
import { parseSeedPhrase } from 'near-seed-phrase';

import { store } from '..';
import CONFIG from '../config';
import { promptTwoFactor, refreshAccount } from '../redux/actions/account';
import { WalletError } from './walletError';

const {
    multisig: { Account2FA },
    Connection,
    keyStores: { InMemoryKeyStore },
    KeyPair,
} = nearApiJs;

export class TwoFactor extends Account2FA {
    constructor(wallet, accountId, has2fa = false) {
        super(wallet.connection, accountId, {
            storage: localStorage,
            helperUrl: CONFIG.ACCOUNT_HELPER_URL,
            getCode: () => store.dispatch(promptTwoFactor(true)).payload.promise
        });
        this.wallet = wallet;
        this.has2fa = has2fa;
    }

    static async has2faEnabled(account) {
        const state = await account.state();
        if (!state) {
            return false;
        }
        return CONFIG.MULTISIG_CONTRACT_HASHES.includes(state.code_hash);
    }

    static async checkCanEnableTwoFactor(balance) {
        const availableBalance = new BN(balance.available);
        const multisigMinAmount = new BN(nearApiJs.utils.format.parseNearAmount(CONFIG.MULTISIG_MIN_AMOUNT));
        return multisigMinAmount.lt(availableBalance);
    }

    async get2faMethod() {
        if (TwoFactor.has2faEnabled(this)) {
            return super.get2faMethod();
        }
        return null;
    }

    async initTwoFactor(accountId, method) {
        // additional check if the ledger is enabled, in case the user was able to omit disabled buttons
        const isLedgerEnabled = await this.wallet.isLedgerEnabled();
        if (isLedgerEnabled) {
            throw new WalletError('Ledger Hardware Wallet is enabled', 'initTwoFactor.ledgerEnabled');
        }

        // clear any previous requests in localStorage (for verifyTwoFactor)
        this.setRequest({ requestId: -1 });
        return await this.wallet.postSignedJson('/2fa/init', {
            accountId,
            method
        });
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
        await store.dispatch(refreshAccount());
        this.has2fa = false;
        return result;
    }

    static async disableMultisigWithFAK({ accountId, seedPhrase, cleanupState }) {
        const keyStore = new InMemoryKeyStore();
        await keyStore.setKey(CONFIG.NETWORK_ID, accountId, KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey));
        const connection = Connection.fromConfig({
            networkId: CONFIG.NETWORK_ID,
            provider: {
                type: 'JsonRpcProvider',
                args: { url: CONFIG.NODE_URL },
            },
            signer: { type: 'InMemorySigner', keyStore },
        });

        const emptyContractBytes = new Uint8Array(await (await fetch('/main.wasm')).arrayBuffer());
        let cleanupContractBytes;
        if (cleanupState) {
            cleanupContractBytes = new Uint8Array(await (await fetch('/state_cleanup.wasm')).arrayBuffer());
        }

        const account = new Account2FA(connection, accountId, {
            helperUrl: CONFIG.ACCOUNT_HELPER_URL,
        });

        return await account.disableWithFAK({ contractBytes: emptyContractBytes, cleanupContractBytes });
    }
}
