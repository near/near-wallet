import BN from 'bn.js'

export function decorateWithLockup(account, lockupAccount) {
    // TODO: Use solution without hacky mix-in inheritance
    // TODO: Looks like best if near-api-js allows to specify transaction middleware

    let decorated = {...account, wrappedAccount: account, lockupAccount, signAndSendTransaction };
    decorated.__proto__ = account.__proto__;
    return decorated;
}

async function signAndSendTransaction(receiverId, actions) {
    const { available: balance } = await this.getAccountBalance()

    // TODO: Take some gas allowance into account
    // TODO: Take min balance into account
    const total = actions.map(action => action?.transfer?.deposit || action?.functionCall?.deposit)
        .filter(deposit => !!deposit)
        .reduce((a, b) => new BN(a).add(new BN(b)), "0");

    const lockupTransferAmount = new BN(total).sub(new BN(balance))
    if (lockupTransferAmount.gt(new BN(0))) {
        console.warn('Not enough balance on main account');
        const liquidBalance = await lockupAccount.viewFunction('get_liquid_owners_balance')
        if (!new BN(liquidBalance).gt(lockupTransferAmount)) {
            // TODO: Check message code
            throw new WalletError('Insufficient balance', 'account.error.insufficientFunds')
        }

        // TODO: better gas calculation (use base amount multiples)
        await lockupAccount.functionCall('transfer', { amount: lockupTransferAmount }, new BN(50000000000000))
        // TODO: withdraw from lockup if not enough
        // TODO: check if not in staking pool and then remove to take remainder
    }

    this.wrappedAccount.signAndSendTransaction.call(this, receiverId, actions);
}