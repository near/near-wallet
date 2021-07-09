import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import sendJson from '../tmp_fetch_send_json';
import { parseTokenAmount } from '../utils/amounts';
import { ACCOUNT_HELPER_URL } from '../utils/wallet';

const {
    transactions: {
        functionCall
    },
    utils: {
        format: { 
            parseNearAmount
        }
    }
} = nearApiJs;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// set this to the same value as we use for creating an account and the remainder is refunded
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
const FT_TRANSFER_DEPOSIT = '1';

// Fungible Token Standard
// https://github.com/near/NEPs/tree/master/specs/Standards/FungibleToken
export class FungibleTokens {
    constructor(account) {
        this.account = account;
    }

    async isStorageBalanceAvailable(contractName, accountId) {
        return new BN((await this.getStorageBalance(contractName, accountId)).total).gte(new BN(FT_MINIMUM_STORAGE_BALANCE));
    }

    async getStorageBalance(contractName, accountId) {
        return await this.account.viewFunction(contractName, 'storage_balance_of', { account_id: accountId });
    }

    async transfer({ contractMetadata: { contractName, decimals }, amount, receiverId, memo }) {
        return await this.signAndSendTransaction(contractName, [
            functionCall('ft_transfer', {
                receiver_id: receiverId,
                amount: parseTokenAmount(amount, decimals),
                memo: memo
            }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT)
        ]);
    }

    async transferStorageDeposit(contractName, accountId) {
        return this.signAndSendTransaction(contractName, [
            functionCall('storage_deposit', {
                account_id: accountId,
                registration_only: true,
            }, FT_STORAGE_DEPOSIT_GAS, FT_MINIMUM_STORAGE_BALANCE)
        ]);
    }

    async signAndSendTransaction(receiverId, actions) {
        return await this.account.signAndSendTransaction(receiverId, actions);
    }

    getLikelyTokenContracts() {
        return sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${this.account.accountId}/likelyTokens`);
    }

    async getMetadata(contractName) {
        return await this.account.viewFunction(contractName, 'ft_metadata');
    }

    async getBalanceOf(contractName) {
        return await this.account.viewFunction(contractName, 'ft_balance_of', { account_id: this.account.accountId });
    }
}
