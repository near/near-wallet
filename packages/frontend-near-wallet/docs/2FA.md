# Two Factor Accounts

## High Level

Every wallet 2FA account has a multisig contract deployed with 3 keys and requires 2 confirmations.

The latest contract is always here:
https://github.com/near/core-contracts/blob/master/multisig/src/lib.rs

The NEAR wallet user will have a private key for 2/3 keys and the NEAR Wallet Contract Helper (CH) has 1 key.

Location of keys:
1. is in localStorage on the device the account / 2FA was set up - you can get the private key if you need to use it in the near CLI
2. is a recovery key that was emailed when the account was created - you can get private key from seed phrase: https://github.com/near/near-seed-phrase
3. is in contract helper can ONLY confirm requests - you cannot use this key

You can also add more keys with method permissions `add_request_and_confirm,confirm` for convenience.

## How to Make a 2FA Request

A 2FA request has a receiver accountId and actions. Some minor adjustments re: actions are needed.

### Example: Transfer
```
const request = {
    receiverId: accountId,
    actions: {
        type: 'Transfer',
        // denominated in NEAR e.g. Big(1).times(10 ** 24).toString()
        // '1000000000000000000000000'
        amount: U128,
    }
}
```
Next, get the request nonce (the ID of the next multisig request) and call the method `add_request_and_confirm` on your account:
```
const requestId = await contract.get_request_nonce()
const contract = new nearApiJs.Contract(account, account.accountId, {
    changeMethods: ['add_request_and_confirm', 'confirm'],
})
await contract.add_request_and_confirm({ request })
```

Finally, **using another key**, call the `confirm` method on your account with the request ID from above:
```
await contract.add_request_and_confirm({ request_id: requestId })
```
Ideally, the key calling confirm is the *"other factor"* device. In the case of the NEAR Wallet, the Contract Helper will be calling confirm on behalf of your account only *after* you verify the correct 6 digit security code.

## Is My Account 2FA Enabled?

You can check on the NEAR Wallet, but if you need to do so programmitcally there are a few ways to do this:

1. Check the code hash of the account state to see if it matches one of:
https://github.com/near/near-wallet/blob/79a350dc134331a17cb4627c5e3a9c5741b6a9cc/src/utils/wallet.js#L43-L52

2. Call `/account/recoveryMethods` on the NEAR Wallet Contract Helper. A 2FA account will have a method beginning with `2fa-` either `2fa-email` or `2fa-phone`

For (2)

POST https://helper.mainnet.near.org/account/recoveryMethods

You need to provide a signature, here's an example from the wallet:
https://github.com/near/near-wallet/blob/79a350dc134331a17cb4627c5e3a9c5741b6a9cc/src/utils/wallet.js#L585-L600
