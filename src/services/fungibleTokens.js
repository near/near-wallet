import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import sendJson from '../tmp_fetch_send_json';
import { wallet } from '../utils/wallet';
import { ACCOUNT_HELPER_URL } from '../utils/wallet';

const FT_MINIMUM_STORAGE_BALANCE = '1250000000000000000000';
const FT_STORAGE_DEPOSIT_GAS = '30000000000000';
const FT_TRANSFER_GAS = '30000000000000';
const FT_TRANSFER_DEPOSIT = '1';

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
        return await this.account.viewFunction(contractName, 'storage_balance_of', { account_id: accountId });
    }

    async transfer(contractName, amount, memo, receiver) {
        await this.signAndSendTransaction(contractName, [
            functionCall('ft_transfer', {
                receiver_id: receiver,
                amount: await this.calculateAmount(contractName, amount),
                memo: memo
            }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT)
        ]);
    }

    async calculateAmount(contractName, amount) {
        const { metadata } = await this.getMetadata(contractName);
        return new BN(10).pow(new BN(metadata.decimals)).mul(new BN(amount)).toString();
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
        return await this.account.signAndSendTransaction(receiverId, actions);
    }

    getLikelyTokenContracts = () => (
        sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${this.account.accountId}/likelyTokens`)
    )

    async getMetadata(contractName) {
        // FungibleTokenMetadata interface
        // https://github.com/near/NEPs/blob/master/specs/Standards/FungibleToken/Metadata.md
        const metadata = await this.account.viewFunction(contractName, 'ft_metadata');
    
        return {
            contractName,
            metadata
        };
    }

    async getBalanceOf(contractName) {
        const balance = await this.account.viewFunction(contractName, 'ft_balance_of', { account_id: this.account.accountId });
        return {
            contractName,
            balance
        };
    }
}

export const fungibleTokens = new FungibleTokens();
