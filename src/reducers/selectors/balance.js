import BN from 'bn.js'

import { LOCKUP_MIN_BALANCE } from '../../utils/account-with-lockup'

export const selectProfileBalance = (balance) => {
    if (!balance || !balance.available) {
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
        stakedBalanceLockup,
        account
    } = balance

    const lockupIdExists = !!lockedAmount

    const walletBalance = {
        walletBalance: new BN(stakedBalanceMainAccount).add(new BN(balanceAvailable)).add(new BN(stateStaked)).toString(),
        reservedForStorage: stateStaked,
        inStakingPools: {
            sum: stakedBalanceMainAccount,
            staked: account?.totalStaked,
            pendingRelease: account?.totalPending,
            availableForWithdraw: account?.totalAvailable
        },
        available: balanceAvailable
    }

    let lockupBalance = {}
    if (lockupIdExists) {
        const {
            lockupAccount
        } = balance

        lockupBalance = {
            lockupBalance: totalBalance,
            reservedForStorage: LOCKUP_MIN_BALANCE.toString(),
            inStakingPools: {
                sum: stakedBalanceLockup,
                staked: lockupAccount?.totalStaked,
                pendingRelease: lockupAccount?.totalPending && new BN(lockupAccount.totalPending).toString(),
                availableForWithdraw: lockupAccount?.totalAvailable && new BN(lockupAccount.totalAvailable).toString()
            },
            locked: lockedAmount,
            unlocked: {
                sum: ownersBalance,
                availableToTransfer: liquidOwnersBalance
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
