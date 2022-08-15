import { BN } from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { store } from '..';
import { ACCOUNT_HELPER_URL, MULTISIG_CONTRACT_HASHES, MULTISIG_MIN_AMOUNT } from '../config';
import { promptTwoFactor, refreshAccount } from '../redux/actions/account';
import { WalletError } from './walletError';

const {
    multisig: { Account2FA },
} = nearApiJs;

export class TwoFactor extends Account2FA {
    constructor(wallet, accountId, has2fa = false) {
        super(wallet.connection, accountId, {
            storage: localStorage,
            helperUrl: ACCOUNT_HELPER_URL,
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
        return MULTISIG_CONTRACT_HASHES.includes(state.code_hash);
    }

    static async checkCanEnableTwoFactor(balance) {
        const availableBalance = new BN(balance.available);
        const multisigMinAmount = new BN(nearApiJs.utils.format.parseNearAmount(MULTISIG_MIN_AMOUNT));
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
        const accessKeys = await this.wallet.getAccessKeys();
        const ledgerKey = accessKeys.find((key) => key.meta.type === 'ledger');
        // throw error if ledger is enabled
        if (ledgerKey) {
            throw new WalletError('Ledger Hardware Wallet is enabled', 'initTwoFactor.ledgerEnabled');
        }

        // additional check if the ledger is not connected but exists as a recovery method
        const userRecoveryMethods = await this.wallet.getRecoveryMethods();
        const accountState = await this.wallet.loadAccount();
        const keys = accountState.fullAccessKeys || [];
        const publicKeys = keys.map((key) => key.public_key);
        const hasLedger = userRecoveryMethods.filter((method) => method.kind === 'ledger').map((key) => key.publicKey).some((key) => publicKeys.includes(key));
        const ledgerIsConnected = accountState.ledgerKey;
        const hasLedgerButNotConnected = hasLedger && !ledgerIsConnected;
        if (hasLedgerButNotConnected) {
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
        const result = await this.disable(contractBytes, stateCleanupContractBytes);
        await store.dispatch(refreshAccount());
        this.has2fa = false;
        return result;
    }
}
