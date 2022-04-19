import BN from 'bn.js';

import { MIN_BALANCE_FOR_GAS } from '../../../config';

export const selectProfileBalance = (walletAccount) => {
    let walletBalance = {
        available: '0',
        inStakingPools: {
            availableForWithdraw: '0',
            pendingRelease: '0',
            staked: '0',
            sum: '0',
        },
        reservedForStorage: '0',
        reservedForTransactions: '0',
        walletBalance: '0'
    };

    const balance = walletAccount?.balance;

    if (walletAccount?.accountExists === false) {
        return {
            walletBalance
        };
    }

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
        available,
        lockupReservedForStorage
    } = balance;

    const lockupIdExists = !!lockedAmount;

    walletBalance = {
        walletBalance: walletAccount?.amount,
        reservedForStorage: stateStaked.toString(),
        reservedForTransactions: BN.min(new BN(available), new BN(MIN_BALANCE_FOR_GAS)).toString(),
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
            lockupBalance: new BN(totalBalance).sub(new BN(stakedBalanceLockup)).toString(),
            reservedForStorage: lockupReservedForStorage.toString(),
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
