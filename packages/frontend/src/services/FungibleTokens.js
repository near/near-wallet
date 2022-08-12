import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';
import * as Multisig from 'multisign/client';

import { 
    NEAR_TOKEN_ID,
    TOKEN_TRANSFER_DEPOSIT,
    FT_TRANSFER_GAS,
    FT_STORAGE_DEPOSIT_GAS,
    FT_MINIMUM_STORAGE_BALANCE,
    FT_MINIMUM_STORAGE_BALANCE_LARGE,
    SEND_NEAR_GAS,
} from '../config';
import {
    parseTokenAmount,
    formatTokenAmount,
    removeTrailingZeros,
} from '../utils/amounts';
import { getTotalGasFee } from '../utils/gasPrice';
import { wallet } from '../utils/wallet';
import { listLikelyTokens } from './indexer';

const {
    transactions: { functionCall, transfer },
    utils: {
        format: { parseNearAmount, formatNearAmount },
    },
} = nearApiJs;

// Fungible Token Standard
// https://github.com/near/NEPs/tree/master/specs/Standards/FungibleToken
export default class FungibleTokens {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare');

    static getParsedTokenAmount(amount, symbol, decimals) {
        const parsedTokenAmount =
            symbol === 'NEAR'
                ? parseNearAmount(amount)
                : parseTokenAmount(amount, decimals);

        return parsedTokenAmount;
    }

    static getFormattedTokenAmount(amount, symbol, decimals) {
        const formattedTokenAmount =
            symbol === 'NEAR'
                ? formatNearAmount(amount, 5)
                : removeTrailingZeros(formatTokenAmount(amount, decimals, 5));

        return formattedTokenAmount;
    }

    static getUniqueTokenIdentity(token) {
        return token.contractName || token.onChainFTMetadata?.symbol;
    }

    static async getLikelyTokenContracts({ accountId }) {
        return listLikelyTokens(accountId);
    }

    static async getStorageBalance({ contractName, accountId }) {
        return await this.viewFunctionAccount.viewFunction(
            contractName,
            'storage_balance_of',
            { account_id: accountId }
        );
    }

    static async getMetadata({ contractName }) {
        return this.viewFunctionAccount.viewFunction(
            contractName,
            'ft_metadata'
        );
    }

    static async getBalanceOf({ contractName, accountId }) {
        return this.viewFunctionAccount.viewFunction(
            contractName,
            'ft_balance_of',
            { account_id: accountId }
        );
    }

    async getEstimatedTotalFees({ accountId, contractName } = {}) {
        if (
            contractName &&
            accountId &&
            !(await this.isStorageBalanceAvailable({ contractName, accountId }))
        ) {
            const totalGasFees = await getTotalGasFee(new BN(FT_TRANSFER_GAS).add(new BN(FT_STORAGE_DEPOSIT_GAS)));
            return new BN(totalGasFees).add(new BN(FT_MINIMUM_STORAGE_BALANCE)).toString();
        } else {
            return getTotalGasFee(contractName ? FT_TRANSFER_GAS : SEND_NEAR_GAS);
        }
    }

    async getEstimatedTotalNearAmount({ amount }) {
        return new BN(amount)
            .add(new BN(await this.getEstimatedTotalFees()))
            .toString();
    }

    async isStorageBalanceAvailable({ contractName, accountId }) {
        const storageBalance = await this.constructor.getStorageBalance({
            contractName,
            accountId,
        });
        return storageBalance?.total !== undefined;
    }

    async transfer({ accountId, contractName, amount, receiverId, memo }) {
        console.log('contract', contractName);
        console.log('transfer', contractName, accountId, amount, receiverId);

        if (contractName) {
            const action = Multisig.functionCall(
                'ft_transfer',
                {
                    amount,
                    memo: memo,
                    receiver_id: receiverId,
                },
                FT_TRANSFER_GAS,
                TOKEN_TRANSFER_DEPOSIT
            );

            console.log(action);
            return Multisig.signAndSendTransaction(
                accountId,
                contractName,
                action
            )
        }

        const action = Multisig.transfer(amount);
        return Multisig.signAndSendTransaction(
            accountId,
            receiverId,
            action
        )        
    }

    async transferStorageDeposit({
        account,
        contractName,
        receiverId,
        storageDepositAmount,
    }) {
        return account.signAndSendTransaction({
            receiverId: contractName,
            actions: [
                functionCall(
                    'storage_deposit',
                    {
                        account_id: receiverId,
                        registration_only: true,
                    },
                    FT_STORAGE_DEPOSIT_GAS,
                    storageDepositAmount
                ),
            ],
        });
    }

    async wrapNear({ accountId, wrapAmount, toWNear }) {
        const account = await wallet.getAccount(accountId);
        const actions = [
            functionCall(
                toWNear ? 'near_deposit' : 'near_withdraw',
                toWNear ? {} : { amount: wrapAmount },
                FT_STORAGE_DEPOSIT_GAS,
                toWNear ? wrapAmount : TOKEN_TRANSFER_DEPOSIT
            ),
        ];

        const storage = await account.viewFunction(
            NEAR_TOKEN_ID,
            'storage_balance_of',
            { account_id: accountId }
        );

        if (!storage) {
            actions.unshift(
                functionCall(
                    'storage_deposit',
                    {},
                    FT_STORAGE_DEPOSIT_GAS,
                    parseNearAmount('0.00125')
                )
            );
        }

        return account.signAndSendTransaction({
            receiverId: NEAR_TOKEN_ID,
            actions,
        });
    }
}

export const fungibleTokensService = new FungibleTokens();
