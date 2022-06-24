import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { NEAR_TOKEN_ID } from '../config';
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

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
// FT_MINIMUM_STORAGE_BALANCE: nUSDC, nUSDT require minimum 0.0125 NEAR. Came to this conclusion using trial and error.
export const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// TODO: Convert all above constants into yoctoNEAR and add to config

// Estimated gas required to call ft_transfer function call (remaining gas is refunded)
const FT_TRANSFER_GAS = '15000000000000'; // 15 TGAS

// https://docs.near.org/docs/concepts/gas#the-cost-of-common-actions
const SEND_NEAR_GAS = '450000000000'; // 0.45 TGAS

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
const FT_TRANSFER_DEPOSIT = '1';

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
        // Ensure our awareness of 2FA being enabled is accurate before we submit any transaction(s)
        const account = await wallet.getAccount(accountId);

        if (contractName) {
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
                        FT_TRANSFER_DEPOSIT
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

    async wrapNear({ accountId, wrapAmount, toWNear }) {
        const account = await wallet.getAccount(accountId);
        const actions = [
            functionCall(
                toWNear ? 'near_deposit' : 'near_withdraw',
                toWNear ? {} : { amount: wrapAmount },
                FT_STORAGE_DEPOSIT_GAS,
                toWNear ? wrapAmount : FT_TRANSFER_DEPOSIT
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
