import * as Sentry from '@sentry/browser';
import * as nearApiJs from 'near-api-js';

import sendJson from '../tmp_fetch_send_json';
import { wallet } from '../utils/wallet';
import { ACCOUNT_HELPER_URL } from '../utils/wallet';

const FT_MINIMUM_STORAGE_BALANCE = '1250000000000000000000';
const FT_STORAGE_DEPOSIT_GAS = '30000000000000';
const {
    transactions: {
        functionCall
    }
} = nearApiJs;

class FungibleTokens {
    constructor() {
        this.account = wallet.getAccountBasic();
    }

    async isStorageBalanceAvailable(contractName, accountId) {
        return new BN((await this.checkStorageBalance(contractName, accountId)).total).gte(new BN(FT_MINIMUM_STORAGE_BALANCE));
    }

    async checkStorageBalance(contractName, accountId) {
        return await this.account.viewFunction(contractName, 'storage_balance_of', { account_id: accountId }).catch(logError);
    }

    async transferStorageDeposit(contractName, accountId) {
        await this.signAndSendTransaction(contractName, [
            functionCall('storage_deposit', {
                account_id: accountId,
                registration_only: true,
            }, FT_STORAGE_DEPOSIT_GAS, FT_MINIMUM_STORAGE_BALANCE)
        ]);
    }

    async signAndSendTransaction(receiverId, actions) {
        return await this.account.signAndSendTransaction(receiverId, actions).catch(logError);
    }

    getLikelyTokenContracts = () => (
        sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${this.account.accountId}/likelyTokens`).catch(logError)
    )
}

const logError = (error) => {
    console.warn(error);
    Sentry.captureException(error);
};

export const fungibleTokens = new FungibleTokens();
