import BN from 'bn.js';
import FungibleTokens from "./FungibleTokens";
import * as nearApiJs from 'near-api-js';
import {
    wallet
} from '../utils/wallet';
import { WRAP_NEAR_CONTRACT_ID } from '../config';
import { async } from "regenerator-runtime";

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


const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125');
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
const FT_WRAPPING_GAS = parseNearAmount('0.00000000003');
const FT_WRAPPING_DEPOSIT = '1';

export default class WrappedNearToken extends FungibleTokens {


    wrapNear = async ({ accountId, amount }) => {
        const account = await wallet.getAccount(accountId);

        const actions = [this.getDepositAction(amount)];
        if (!await this.isWrappedNearStorageBalanceAvailable({ accountId })) {
            actions.unshift(this.getStorageDepositAction());
        }

        return account.signAndSendTransaction({
            receiverId: WRAP_NEAR_CONTRACT_ID,
            actions,
        });
    }

    unwrapNear = async ({ accountId, amount }) => {
        const account = await wallet.getAccount(accountId);
        const actions = [this.getWithdrawAction(amount)];

        return account.signAndSendTransaction({
            receiverId: WRAP_NEAR_CONTRACT_ID,
            actions,
        });
    }

    getDepositAction = (amount) => {
        return functionCall(
            "near_deposit",
            {},
            FT_WRAPPING_GAS,
            amount
        )
    }

    getWithdrawAction = (amount) => {
        return functionCall(
            "near_withdraw",
            {
                amount: amount
            },
            FT_WRAPPING_GAS,
            FT_WRAPPING_DEPOSIT
        )
    }

    isWrappedNearStorageBalanceAvailable = async ({ accountId }) => {
        const storageBalance = await this.constructor.getStorageBalance({ contractName: WRAP_NEAR_CONTRACT_ID, accountId });
        return storageBalance?.total !== undefined && storageBalance.total !== "0";
    }

    getStorageDepositAction = () => {
        return functionCall(
            "storage_deposit", // method to create an account
            {
                registration_only: true,
            },
            FT_STORAGE_DEPOSIT_GAS, // attached gas
            FT_MINIMUM_STORAGE_BALANCE
        )
    }


    getEstimatedTotalFeesForWrapping = async ({ accountId }) => {
        //Currently follows the logic of sending token. The estimation is not accurate.
        if (!await this.isWrappedNearStorageBalanceAvailable({ accountId })) {
            return new BN(FT_STORAGE_DEPOSIT_GAS)
                .add(new BN(FT_MINIMUM_STORAGE_BALANCE))
                .add(new BN(FT_WRAPPING_GAS))
                .toString();
        }
        return new BN(FT_WRAPPING_GAS).toString();

    }

    getEstimatedTotalFeesForUnWrapping = async () => {
        return new BN(FT_WRAPPING_GAS)
            .add(new BN(FT_WRAPPING_DEPOSIT))
            .toString();
    }


    getEstimatedTotalNearAmountForWrapping = async ({ amount, accountId }) => {
        return new BN(amount)
            .add(new BN(await this.getEstimatedTotalFeesForWrapping({ accountId })))
            .toString();
    }
}

export const wrappedNearTokenService = new WrappedNearToken();