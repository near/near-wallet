import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { ACCOUNT_HELPER_URL } from '../../config/settings';
import sendJson from '../tmp_fetch_send_json';
import {
    parseTokenAmount,
    formatTokenAmount,
    removeTrailingZeros
} from '../utils/amounts';
import {
    wallet
} from '../utils/wallet';

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount,
            formatNearAmount
        }
    }
} = nearApiJs;

// account creation costs 0.00125 NEAR for storage, 0.00000000003 NEAR for gas
// https://docs.near.org/docs/api/naj-cookbook#wrap-and-unwrap-near
const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
// FT_MINIMUM_STORAGE_BALANCE: nUSDC, nUSDT require minimum 0.0125 NEAR. Came to this conclusion using trial and error.
const FT_MINIMUM_STORAGE_BALANCE_LARGE = parseNearAmount('0.0125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');

// set this to the same value as we use for creating an account and the remainder is refunded
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

// contract might require an attached depositof of at least 1 yoctoNear on transfer methods
// "This 1 yoctoNEAR is not enforced by this standard, but is encouraged to do. While ability to receive attached deposit is enforced by this token."
// from: https://github.com/near/NEPs/issues/141
const FT_TRANSFER_DEPOSIT = '1';

// Fungible Token Standard
// https://github.com/near/NEPs/tree/master/specs/Standards/FungibleToken
export default class FungibleTokens {
    // View functions are not signed, so do not require a real account!
    static viewFunctionAccount = wallet.getAccountBasic('dontcare')

    static getParsedTokenAmount(amount, symbol, decimals) {
        const parsedTokenAmount = symbol === 'NEAR'
            ? parseNearAmount(amount)
            : parseTokenAmount(amount, decimals);

        return parsedTokenAmount;
    }

    static getFormattedTokenAmount(amount, symbol, decimals) {
        const formattedTokenAmount = symbol === 'NEAR'
            ? formatNearAmount(amount, 5)
            : removeTrailingZeros(formatTokenAmount(amount, decimals, 5));

        return formattedTokenAmount;
    }

    static async getLikelyTokenContracts({ accountId }) {
        return sendJson('GET', `${ACCOUNT_HELPER_URL}/account/${accountId}/likelyTokens`);
    }

    static async getStorageBalance({ contractName, accountId }) {
        return await this.viewFunctionAccount.viewFunction(contractName, 'storage_balance_of', { account_id: accountId });
    }

    static async getMetadata({ contractName }) {
        return this.viewFunctionAccount.viewFunction(contractName, 'ft_metadata');
    }

    static async getBalanceOf({ contractName, accountId }) {
        return this.viewFunctionAccount.viewFunction(contractName, 'ft_balance_of', { account_id: accountId });
    }

    async getEstimatedTotalFees({ accountId, contractName } = {}) {
        if (contractName && accountId && !await this.isStorageBalanceAvailable({ contractName, accountId })) {
            return new BN(FT_TRANSFER_GAS)
                .add(new BN(FT_MINIMUM_STORAGE_BALANCE))
                .add(new BN(FT_STORAGE_DEPOSIT_GAS))
                .toString();
        } else {
            return FT_TRANSFER_GAS;
        }
    }

    async getEstimatedTotalNearAmount({ amount }) {
        return new BN(amount)
            .add(new BN(await this.getEstimatedTotalFees()))
            .toString();
    }

    async isStorageBalanceAvailable({ contractName, accountId }) {
        const storageBalance = await this.constructor.getStorageBalance({ contractName, accountId });
        return storageBalance?.total !== undefined;
    }

    async transfer({ accountId, contractName, amount, receiverId, memo }) {
        // Ensure our awareness of 2FA being enabled is accurate before we submit any transaction(s)
        const account = await wallet.getAccount(accountId);

        if (contractName) {
            const storageAvailable = await this.isStorageBalanceAvailable({ contractName, accountId: receiverId });

            if (!storageAvailable) {
                try {
                    await this.transferStorageDeposit({
                        account,
                        contractName,
                        receiverId,
                        storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE
                    });
                } catch (e) {
                    // sic.typo in `mimimum` wording of responses, so we check substring
                    // Original string was: 'attached deposit is less than the mimimum storage balance'
                    if (e.message.includes('attached deposit is less than')) {
                        await this.transferStorageDeposit({
                            account,
                            contractName,
                            receiverId,
                            storageDepositAmount: FT_MINIMUM_STORAGE_BALANCE_LARGE
                        });
                    }
                }
            }

            return await account.signAndSendTransaction(contractName, [
                functionCall('ft_transfer', {
                    amount,
                    memo: memo,
                    receiver_id: receiverId,
                }, FT_TRANSFER_GAS, FT_TRANSFER_DEPOSIT)
            ]);
        } else {
            return await account.sendMoney(receiverId, amount);
        }
    }

    async transferStorageDeposit({ account, contractName, receiverId, storageDepositAmount }) {
        return account.signAndSendTransaction(
            contractName,
            [
                functionCall('storage_deposit', {
                    account_id: receiverId,
                    registration_only: true,
                }, FT_STORAGE_DEPOSIT_GAS, storageDepositAmount)
            ]
        );
    }
}

export const fungibleTokensService = new FungibleTokens();