import Big from 'big.js';

import CONFIG from '../../../config';
import { decreaseByPercent, getPercentFrom } from '../../../utils/amounts';
import { getTotalGasFee } from '../../../utils/gasPrice';
import { SWAP_GAS_UNITS } from './constants';

export function getMinAmountOut({
    tokenOut,
    amountOut,
    slippage,
}: {
    tokenOut: Wallet.Token;
    amountOut: string;
    slippage: number;
}): string {
    let minAmountOut = '';
    const canCalculateMinAmount =
        typeof slippage === 'number' &&
        typeof tokenOut?.onChainFTMetadata?.decimals === 'number' &&
        amountOut;

    if (canCalculateMinAmount) {
        minAmountOut = !slippage
            ? amountOut
            : decreaseByPercent(amountOut, slippage, tokenOut.onChainFTMetadata.decimals);
    }

    return minAmountOut;
}

export function getSwapFeeAmount({
    amountIn,
    swapFee,
}: {
    amountIn: string;
    swapFee: number;
}): number {
    return amountIn && swapFee >= 0 ? Number(getPercentFrom(amountIn, swapFee)) : 0;
}

async function hasStorageDeposit(
    account: Wallet.Account,
    tokenId: string
): Promise<boolean> {
    if (account && tokenId) {
        try {
            const storageState = await account.viewFunction(
                tokenId,
                'storage_balance_of',
                { account_id: account.accountId }
            );

            return !!storageState;
        } catch (error) {
            console.error('Error on checking storage deposit in swap', error);
        }
    }

    return false;
}

async function getStorageDepositAmount({
    account,
    tokenIds,
}: {
    account: Wallet.Account;
    tokenIds: string[];
}): Promise<number> {
    let storageDepositAmount = 0;
    const storageDepositYoctoNearAmount = Number(CONFIG.FT_MINIMUM_STORAGE_BALANCE_LARGE);

    await Promise.allSettled(
        tokenIds.map(async (tokenId) => {
            const hasStorage = await hasStorageDeposit(account, tokenId);

            if (!hasStorage) {
                storageDepositAmount += storageDepositYoctoNearAmount;
            }
        })
    );

    return storageDepositAmount;
}

export async function getSwapCost({
    account,
    tokenIn,
    tokenOut,
}: {
    account: Wallet.Account;
    tokenIn: Wallet.Token;
    tokenOut: Wallet.Token;
}): Promise<string> {
    const inId = tokenIn?.contractName;
    const outId = tokenOut?.contractName;

    if (!inId || !outId) {
        return '';
    }

    const tokenIds = [inId, outId];
    // Approximate amount of gas we spend in swap
    let swapGasUnits = '';
    // Amount we need to deposit in token storages
    let storageDepositAmount = 0;

    if (tokenIds.includes(CONFIG.NEAR_ID) && tokenIds.includes(CONFIG.NEAR_TOKEN_ID)) {
        // swap NEAR <> wNEAR
        swapGasUnits = SWAP_GAS_UNITS.nearWithWnear;

        // There is NEAR -> wNEAR swap. We need to check wNEAR storage deposit and
        // to add deposit amount in total fee for this action.
        if (tokenIn.contractName === CONFIG.NEAR_ID) {
            storageDepositAmount = await getStorageDepositAmount({
                account,
                tokenIds: [CONFIG.NEAR_TOKEN_ID],
            });
        }
    } else if (tokenIds.includes(CONFIG.NEAR_ID)) {
        // swap NEAR <> NEP141
        swapGasUnits = SWAP_GAS_UNITS.nearWithFT;

        if (tokenIn.contractName === CONFIG.NEAR_ID) {
            storageDepositAmount = await getStorageDepositAmount({
                account,
                tokenIds: [CONFIG.NEAR_TOKEN_ID, tokenOut.contractName],
            });
        }
    } else {
        // swap NEP141 <> NEP141
        swapGasUnits = SWAP_GAS_UNITS.ftWithFt;
        storageDepositAmount = await getStorageDepositAmount({
            account,
            tokenIds: [tokenOut.contractName],
        });
    }

    const swapFee = await getTotalGasFee(swapGasUnits);

    return Big(storageDepositAmount).plus(swapFee).toFixed();
}
