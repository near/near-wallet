import BN from 'bn.js'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { BinaryReader } from 'near-api-js/lib/utils/serialize'
import { Account } from 'near-api-js'
import sha256 from 'js-sha256'
import { LOCKUP_ACCOUNT_ID_SUFFIX } from './wallet'

export function decorateWithLockup(account) {
    // TODO: Use solution without hacky mix-in inheritance
    // TODO: Looks like best if near-api-js allows to specify transaction middleware

    let decorated = {...account, wrappedAccount: account, signAndSendTransaction, getAccountBalance };
    decorated.__proto__ = account.__proto__;
    return decorated;
}

async function signAndSendTransaction(receiverId, actions) {
    const { available: balance } = await this.getAccountBalance()

    // TODO: Should gas allowance be dynamically calculated
    const MIN_BALANCE_FOR_GAS = new BN(parseNearAmount('2'));
    // TODO: Extract code to compute total cost of transaction
    const total = actions.map(action => action?.transfer?.deposit || action?.functionCall?.deposit)
        .filter(deposit => !!deposit)
        .map(str => new BN(str))
        .reduce((a, b) => a.add(b), new BN("0"));

    const missingAmount = total.sub(new BN(balance)).add(MIN_BALANCE_FOR_GAS);
    if (missingAmount.gt(new BN(0))) {
        console.warn('Not enough balance on main account');

        const lockupAccountId = getLockupAccountId(accountId)

        // TODO: How to get potentially unlocked balance before sending money (and so balance check)?
        if (!(await this.wrappedAccount.viewFunction(lockupAccountId, 'are_transfers_enabled'))) {
            await this.wrappedAccount.functionCall(lockupAccountId, 'check_transfers_vote', {}, new BN(75000000000000))
        }
        // TODO: Make check_transfers_vote transaction to update lockup status
        // TODO: Make sure to avoid panic_msg: "panicked at 'Transfers are already enabled', src/internal.rs:72:9"

        const liquidBalance = new BN(await this.wrappedAccount.viewFunction(lockupAccountId, 'get_liquid_owners_balance'))
        if (!liquidBalance.gt(missingAmount)) {
            throw new WalletError('Not enough tokens.', 'sendMoney.amountStatusId.notEnoughTokens')
        }

        // TODO: better gas calculation (use base amount multiples)
        await this.wrappedAccount.functionCall(lockupAccountId, 'transfer', {
            // NOTE: Move all the liquid tokens to minimize transactions in the long run
            amount: liquidBalance.toString(),
            receiver_id: this.wrappedAccount.accountId
        }, new BN(50000000000000))

        // TODO: check if not in staking pool and then remove to take remainder (if balance is zero)
    }

    this.wrappedAccount.signAndSendTransaction.call(this, receiverId, actions);
}

function getLockupAccountId(accountId) {
    return sha256(Buffer.from(accountId)).substring(0, 40) + '.' + LOCKUP_ACCOUNT_ID_SUFFIX
}

async function getAccountBalance() {
    const balance = await this.wrappedAccount.getAccountBalance()

    // TODO: Should lockup contract balance be retrieved separately only when needed?
    const lockupAccountId = getLockupAccountId(this.accountId)
    console.log('lockupAccountId', lockupAccountId)
    try {
        // TODO: Makes sense for a lockup contract to return whole state as JSON instead of method per property
        const [
            ownersBalance,
            liquidOwnersBalance,
            lockedAmount,
        ] = await Promise.all([
            'get_owners_balance',
            'get_liquid_owners_balance',
            'get_locked_amount',
        ].map(methodName => this.viewFunction(lockupAccountId, methodName)))

        return {
            ...balance,
            ownersBalance,
            liquidOwnersBalance,
            lockedAmount,
            total: new BN(balance.total).add(new BN(lockedAmount)).add(new BN(ownersBalance)).toString()
        }
    } catch (error) {
        if (error.message.match(/Account ".+" doesn't exist/) || error.message.includes('cannot find contract code for account')) {
            return balance
        }
        throw error
    }
}