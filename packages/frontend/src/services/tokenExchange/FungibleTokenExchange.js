import { transactions } from 'near-api-js';

import CONFIG from '../../config';
import { fungibleTokensService } from '../FungibleTokens';
import refFinanceContract from './RefFinanceContract';

class FungibleTokenExchange {
    constructor({ exchaingeContract, tokenService }) {
        this._exchangeContract = exchaingeContract;
        this._tokenService = tokenService;
    }

    async getData({ account }) {
        return this._exchangeContract.getData({ account });
    }

    async estimate(params) {
        if (this.isNearTransformation(params)) {
            return this._estimateNearSwap(params);
        }

        return this._estimateSwap(params);
    }

    async swap(params) {
        if (this.isNearTransformation(params)) {
            return this._transformNear(params);
        }

        const { account, poolId, tokenIn, tokenOut, amountIn, minAmountOut } = params;
        const {
            contractName: tokenInId,
            onChainFTMetadata: { decimals: tokenInDecimals },
        } = tokenIn;
        const {
            contractName: tokenOutId,
            onChainFTMetadata: { decimals: tokenOutDecimals },
        } = tokenOut;

        const swapParams = {
            account,
            poolId,
            tokenInId,
            tokenInDecimals,
            amountIn,
            tokenOutId,
            tokenOutDecimals,
            minAmountOut,
        };

        if (tokenInId === CONFIG.NEAR_ID) {
            return this._swapNearToToken(swapParams);
        }

        if (tokenInId === CONFIG.NEAR_TOKEN_ID) {
            return this._swapWNearToToken(swapParams);
        }

        if (tokenOutId === CONFIG.NEAR_ID) {
            return this._swapTokenToNear(swapParams);
        }

        if (tokenOutId === CONFIG.NEAR_TOKEN_ID) {
            return this._swapTokenToWNear(swapParams);
        }

        return this._swapTokenToToken(swapParams);
    }

    isNearTransformation(params) {
        const { tokenIn, tokenOut } = params;
        const ids = [tokenIn.contractName, tokenOut.contractName];

        return ids.includes(CONFIG.NEAR_TOKEN_ID) && ids.includes(CONFIG.NEAR_ID);
    }

    replaceNearIdIfNecessary(id) {
        return id === CONFIG.NEAR_ID ? CONFIG.NEAR_TOKEN_ID : id;
    }

    _estimateNearSwap(params) {
        return {
            amountOut: params.amountIn,
        };
    }

    async _estimateSwap(params) {
        const { tokenIn, tokenOut } = params;

        return this._exchangeContract.estimate({
            ...params,
            tokenInId: this.replaceNearIdIfNecessary(tokenIn.contractName),
            tokenInDecimals: tokenIn.onChainFTMetadata.decimals,
            tokenOutId: this.replaceNearIdIfNecessary(tokenOut.contractName),
            tokenOutDecimals: tokenOut.onChainFTMetadata.decimals,
        });
    }

    async _transformNear(params) {
        const { account, tokenIn, amountIn } = params;

        const {
            transaction: { hash },
        } = await this._tokenService.transformNear({
            accountId: account.accountId,
            amount: amountIn,
            toWNear: tokenIn.contractName !== CONFIG.NEAR_TOKEN_ID,
        });

        return {
            success: true,
            swapTxHash: hash,
        };
    }

    async _swapNearToToken(params) {
        const { account, tokenOutId, amountIn } = params;
        const transactions = [];
        const depositTransactions = await this._getDepositTransactions(
            account,
            [tokenOutId]
        );

        if (depositTransactions) {
            transactions.push(...depositTransactions);
        }

        const wrapNear = await this._tokenService.getWrapNearTx({
            accountId: account.accountId,
            amount: amountIn,
        });
        const swapActions = await this._exchangeContract.getSwapActions({
            ...params,
            tokenInId: CONFIG.NEAR_TOKEN_ID,
        });

        transactions.push(wrapNear, {
            receiverId: CONFIG.NEAR_TOKEN_ID,
            actions: swapActions,
        });

        return this._processTransactions(account, transactions);
    }

    async _swapWNearToToken(params) {
        const { account, tokenOutId } = params;
        const transactions = [];
        const depositTransactions = await this._getDepositTransactions(
            account,
            [tokenOutId]
        );

        if (depositTransactions) {
            transactions.push(...depositTransactions);
        }

        const swapActions = await this._exchangeContract.getSwapActions(params);

        transactions.push({
            receiverId: CONFIG.NEAR_TOKEN_ID,
            actions: swapActions,
        });

        return this._processTransactions(account, transactions);
    }

    async _swapTokenToNear(params) {
        const { account, tokenInId, minAmountOut } = params;
        const transactions = [];
        const depositTransactions = await this._getDepositTransactions(
            account,
            [tokenInId, CONFIG.NEAR_TOKEN_ID]
        );

        if (depositTransactions) {
            transactions.push(...depositTransactions);
        }

        const swapActions = await this._exchangeContract.getSwapActions({
            ...params,
            tokenOutId: CONFIG.NEAR_TOKEN_ID,
        });
        const unwrapNear = await this._tokenService.getUnwrapNearTx({
            accountId: account.accountId,
            amount: minAmountOut,
        });

        transactions.push(
            {
                receiverId: tokenInId,
                actions: swapActions,
            },
            unwrapNear
        );

        return this._processTransactions(account, transactions);
    }

    async _swapTokenToWNear(params) {
        const { account, tokenInId, tokenOutId } = params;
        const transactions = [];
        const depositTransactions = await this._getDepositTransactions(
            account,
            [tokenInId, tokenOutId]
        );

        if (depositTransactions) {
            transactions.push(...depositTransactions);
        }

        const swapActions = await this._exchangeContract.getSwapActions(params);

        transactions.push({
            receiverId: tokenInId,
            actions: swapActions,
        });

        return this._processTransactions(account, transactions);
    }

    async _swapTokenToToken(params) {
        const { account, tokenInId, tokenOutId } = params;
        const transactions = [];
        const depositTransactions = await this._getDepositTransactions(
            account,
            [tokenInId, tokenOutId]
        );

        if (depositTransactions) {
            transactions.push(...depositTransactions);
        }

        const swapActions = await this._exchangeContract.getSwapActions(params);

        transactions.push({
            receiverId: tokenInId,
            actions: swapActions,
        });

        return this._processTransactions(account, transactions);
    }

    async _getDepositTransactions(account, tokenIds) {
        const txs = [];
        const { accountId } = account;

        for (const id of tokenIds) {
            const tokenStorage = await account.viewFunction(
                id,
                'storage_balance_of',
                { account_id: accountId }
            );

            if (!tokenStorage) {
                txs.push({
                    receiverId: id,
                    actions: [
                        transactions.functionCall(
                            'storage_deposit',
                            {
                                account_id: accountId,
                                signer_id: accountId,
                                receiver_id: id,
                                registration_only: true,
                            },
                            CONFIG.FT_STORAGE_DEPOSIT_GAS,
                            CONFIG.FT_MINIMUM_STORAGE_BALANCE_LARGE
                        ),
                    ],
                });
            }
        }

        return txs.length ? txs : null;
    }

    async _processTransactions(account, txs) {
        const swapResult = {
            success: true,
            swapTxHash: '',
            failReason: '',
        };

        for (const tx of txs) {
            const {
                status,
                receipts_outcome,
                transaction: { hash, actions },
            } = await account.signAndSendTransaction(tx);

            const failedResult = receipts_outcome.find(
                ({ outcome: { status } }) => !!status?.Failure
            );

            swapResult.success = !status?.Failure;

            if (failedResult?.outcome?.status?.Failure) {
                swapResult.success = false;
                swapResult.failReason = this._exchangeContract.extractErrorMessage(
                    failedResult.outcome.status.Failure
                );
            }

            const swapTx = actions.find(
                (action) => action['FunctionCall']?.method_name === 'ft_transfer_call'
            );

            if (swapTx) {
                swapResult.swapTxHash = hash;
            }
        }

        return swapResult;
    }
}

export default new FungibleTokenExchange({
    exchaingeContract: refFinanceContract,
    tokenService: fungibleTokensService,
});
