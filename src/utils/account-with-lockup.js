import BN from 'bn.js'
import { parseNearAmount } from 'near-api-js/lib/utils/format'

export function decorateWithLockup(account, lockupAccount) {
    // TODO: Use solution without hacky mix-in inheritance
    // TODO: Looks like best if near-api-js allows to specify transaction middleware

    let decorated = {...account, wrappedAccount: account, lockupAccount, signAndSendTransaction };
    decorated.__proto__ = account.__proto__;
    return decorated;
}

async function signAndSendTransaction(receiverId, actions) {
    const { available: balance } = await this.getAccountBalance()

    // TODO: Should gas allowance be dynamically calculated
    const MIN_BALANCE_FOR_GAS = parseNearAmount('2');
    // TODO: Extract code to compute total cost of transaction
    const total = actions.map(action => action?.transfer?.deposit || action?.functionCall?.deposit)
        .filter(deposit => !!deposit)
        .reduce((a, b) => new BN(a).add(new BN(b)), "0");

    const missingAmount = new BN(total).sub(new BN(balance)).add(new BN(MIN_BALANCE_FOR_GAS));
    if (missingAmount.gt(new BN(0))) {
        console.warn('Not enough balance on main account');

        // TODO: Make check_transfers_vote transaction to update lockup status
        // TODO: Make sure to avoid panic_msg: "panicked at 'Transfers are already enabled', src/internal.rs:72:9"

        const liquidBalance = await this.wrappedAccount.viewFunction(this.lockupAccount.accountId, 'get_liquid_owners_balance')
        if (!new BN(liquidBalance).gt(missingAmount)) {
            throw new WalletError('Not enough tokens.', 'sendMoney.amountStatusId.notEnoughTokens')
        }

        // TODO: better gas calculation (use base amount multiples)
        await this.wrappedAccount.functionCall(this.lockupAccount.accountId, 'transfer', {
            amount: missingAmount.toString(),
            receiver_id: this.wrappedAccount.accountId
        }, new BN(50000000000000))
        // TODO: withdraw from lockup if not enough
        // TODO: check if not in staking pool and then remove to take remainder
    }

    this.wrappedAccount.signAndSendTransaction.call(this, receiverId, actions);
}