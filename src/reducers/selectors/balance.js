import BN from 'bn.js'

import { LOCKUP_MIN_BALANCE } from '../../utils/account-with-lockup'

export const selectProfileBalance = (balance) => {
    if (!balance?.account?.totalAvailable) {
        return false
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
        account: {
            totalAvailable,
            totalPending,
            totalStaked,
            totalUnstaked
        },
        lockupIdExists
    } = balance

    const walletBalance = {
        walletBalance: stakedBalanceMainAccount.add(new BN(balanceAvailable)).add(new BN(stateStaked)).toString(),
        reservedForStorage: stateStaked.toString(),
        inStakingPools: {
            sum: stakedBalanceMainAccount.toString(),
            staked: totalStaked,
            pendingRelease: totalPending,
            availableForWithdraw: totalAvailable
        },
        available: totalUnstaked
    }

    let lockupBalance = {}
    if (lockupIdExists) {
        const {
            lockupAccount
        } = balance

        lockupBalance = {
            lockupBalance: totalBalance.toString(),
            reservedForStorage: LOCKUP_MIN_BALANCE.toString(),
            inStakingPools: {
                sum: new BN(lockupAccount.totalStaked).add(new BN(lockupAccount.totalPending)).add(new BN(lockupAccount.totalAvailable)).toString(),
                staked: lockupAccount.totalStaked,
                pendingRelease: new BN(lockupAccount.totalPending).toString(),
                availableForWithdraw: new BN(lockupAccount.totalAvailable).toString()
            },
            locked: lockedAmount.toString(),
            unlocked: {
                sum: ownersBalance.toString(),
                availableToTransfer: liquidOwnersBalance.toString()
            }
        }
    }

    return {
        walletBalance,
        lockupId: lockupAccountId,
        lockupBalance,
        lockupIdExists
    }
}
