import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import {
    NEAR_ID,
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
    transactions: { functionCall },
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
            symbol === NEAR_ID
                ? parseNearAmount(amount)
                : parseTokenAmount(amount, decimals);

        return parsedTokenAmount;
    }

    static getFormattedTokenAmount(amount, symbol, decimals) {
        const formattedTokenAmount =
            symbol === NEAR_ID
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
        // Ensure our awareness of 2FA being enabled is accurate before we submit any transaction(s)
        const account = await wallet.getAccount(accountId);

        if (contractName && contractName.toUpperCase() !== NEAR_ID) {
            const storageAvailable = await this.isStorageBalanceAvailable({
                contractName,
                accountId: receiverId,
            });

            if (!storageAvailable) {
                try {
                    await this.transferStorageDeposit({
                        account,
                        contractName,
                        receiverId,
                        storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE,
                    });
                } catch (e) {
                    // sic.typo in `mimimum` wording of responses, so we check substring
                    // Original string was: 'attached deposit is less than the mimimum storage balance'
                    // TODO: Call storage_balance_bounds: https://github.com/near/near-wallet/issues/2522
                    if (e.message.includes('attached deposit is less than')) {
                        await this.transferStorageDeposit({
                            account,
                            contractName,
                            receiverId,
                            storageDepositAmount:
                                FT_MINIMUM_STORAGE_BALANCE_LARGE,
                        });
                    }
                }
            }

            return await account.signAndSendTransaction({
                receiverId: contractName,
                actions: [
                    functionCall(
                        'ft_transfer',
                        {
                            amount,
                            memo: memo,
                            receiver_id: receiverId,
                        },
                        FT_TRANSFER_GAS,
                        TOKEN_TRANSFER_DEPOSIT
                    ),
                ],
            });
        } else {
            return await account.sendMoney(receiverId, amount);
        }
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

    async getWrapNearTx({ accountId, amount }) {
        const actions = await this._getStorageDepositActions(accountId);

        actions.push(
            functionCall(
                'near_deposit',
                {},
                FT_STORAGE_DEPOSIT_GAS,
                parseNearAmount(amount)
            )
        );

        return { receiverId: NEAR_TOKEN_ID, actions };
    }

    async getUnwrapNearTx({ accountId, amount }) {
        const actions = await this._getStorageDepositActions(accountId);

        actions.push(
            functionCall(
                'near_withdraw',
                { amount: parseNearAmount(amount) },
                FT_STORAGE_DEPOSIT_GAS,
                TOKEN_TRANSFER_DEPOSIT,
            )
        );

        return { receiverId: NEAR_TOKEN_ID, actions };
    }

    async transformNear({ accountId, amount, toWNear }) {
        const account = await wallet.getAccount(accountId);
        const tx = await (toWNear
            ? this.getWrapNearTx({ accountId, amount })
            : this.getUnwrapNearTx({ accountId, amount }));

        return account.signAndSendTransaction(tx);
    }

    async _getStorageDepositActions(accountId) {
        const actions = [];
        const storage = await FungibleTokens.getStorageBalance({
            contractName: NEAR_TOKEN_ID,
            accountId,
        });

        if (!storage) {
            actions.push(
                functionCall(
                    'storage_deposit',
                    {},
                    FT_STORAGE_DEPOSIT_GAS,
                    FT_MINIMUM_STORAGE_BALANCE,
                )
            );
        }

        return actions;
    }
}

export const fungibleTokensService = new FungibleTokens();
