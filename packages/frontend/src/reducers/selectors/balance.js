import BN from 'bn.js';
import { utils } from 'near-api-js';

import { LOCKUP_MIN_BALANCE } from '../../utils/account-with-lockup';
import { WALLET_APP_MIN_AMOUNT } from '../../utils/wallet';

const {
    parseNearAmount
} = utils.format;

export const selectProfileBalance = (walletAccount) => {
    const balance = walletAccount?.balance;

    if (!balance || !balance.available) {
        return false;
    }

    const { 
        lockupAccountId,
        stateStaked,
        totalBalance,
        lockedAmount,
        liquidOwnersBalance,
        ownersBalance,
        stakedBalanceMainAccount,
        balanceAvailable,
        stakedBalanceLockup,
        account,
        available
    } = balance;

    const lockupIdExists = !!lockedAmount;

    const walletBalance = {
        walletBalance: walletAccount?.amount,
        reservedForStorage: stateStaked.toString(),
        reservedForTransactions: new BN(available).sub(new BN(parseNearAmount(WALLET_APP_MIN_AMOUNT))).isNeg()
            ? available
            : parseNearAmount(WALLET_APP_MIN_AMOUNT),
        inStakingPools: {
            sum: stakedBalanceMainAccount.toString(),
            staked: account?.totalStaked,
            pendingRelease: account?.totalPending,
            availableForWithdraw: account?.totalAvailable
        },
        available: balanceAvailable
    };

    let lockupBalance = {};
    if (lockupIdExists) {
        const {
            lockupAccount
        } = balance;

        lockupBalance = {
            lockupBalance: totalBalance.toString(),
            reservedForStorage: LOCKUP_MIN_BALANCE.toString(),
            inStakingPools: {
                sum: stakedBalanceLockup.toString(),
                staked: lockupAccount?.totalStaked,
                pendingRelease: lockupAccount?.totalPending && new BN(lockupAccount.totalPending).toString(),
                availableForWithdraw: lockupAccount?.totalAvailable && new BN(lockupAccount.totalAvailable).toString()
            },
            locked: lockedAmount.toString(),
            unlocked: {
                sum: ownersBalance.toString(),
                availableToTransfer: liquidOwnersBalance.toString()
            }
        };
    }

    return {
        walletBalance,
        lockupId: lockupAccountId,
        lockupBalance,
        lockupIdExists
    };
};
