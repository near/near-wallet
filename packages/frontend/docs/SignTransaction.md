Signing transactions
===

Signing a transaction or series of transactions on NEAR Wallet involves constructing the transaction and then using `near-api-js` to redirect the user to the wallet. Once the user approves (or denies) the transaction, they will be redirected to the original url or a pre-specified url. 

## Steps

1. [Construct a transaction](#Construct-a-transaction)
2. [Setup `WalletConnection` and call `requestSignTransactions`](#Setup-WalletConnection-and-callrequestSignTransactions)
3. [Wallet redirect and callback](#Wallet-redirect-and-callback)

## Construct a transaction
At a high level, constructing a transaction is done by calling `createTransaction` from `near-api-js`:

```typescript=
const nearAPI = require("near-api-js");

const transaction = nearAPI.transactions.createTransaction(
  sender,
  publicKey,
  receiver,
  nonce,
  actions,
  recentBlockHash
);
```

More information on each argument can be found [here](https://docs.near.org/docs/tutorials/create-transactions#transaction-requirements).

## Setup `WalletConnection` and call`requestSignTransactions`

Setup a `WalletConnection` instance by passing in your `Near` instance. You can then call `requestSignTransactions` on the `WalletConnection` instance:

```typescript=
const nearAPI = require("near-api-js");
const { connect, WalletConnection } = nearApi;

const near = await connect(config);

const walletConnection = new WalletConnection(near);

// redirect to wallet to sign the transaction
walletConnection.requestSignTransactions({
    transactions: [transaction],
});
```
More information on setting up a connection to NEAR [here](https://docs.near.org/docs/tutorials/create-transactions#setting-up-a-connection-to-near).

`requestSignTransactions` takes in an `options` argument of type `RequestSignTransactionsOptions`:

```typescript=
RequestSignTransactionsOptions {
    /** list of transactions to sign */
    transactions: Transaction[];
    /** url NEAR Wallet will redirect to after transaction signing is complete */
    callbackUrl?: string;
    /** meta information NEAR Wallet will send back to the application. `meta` will be attached to the `callbackUrl` as a url search param */
    meta?: string;
}
```

* The `transactions` property is required and it's a list of transactions that can be created using the method [above](#Construct-a-transaction).
* `callbackUrl` is optional and will default to the current url `window.location.href` when not provided.
* `meta` is optional and can include any information that we'd like forwarded to the `callbackUrl` by the wallet as the `meta` search param.

## Wallet redirect and callback
The user will be presented with a request to sign the transaction(s) that were passed in in the wallet UI: 

<img src="./assets/sign-transaction-request.png" width="500">


Once the user allows or denies the transaction, they will be redirected to `callbackUrl` with the following parameters:

* `transactionHashes`: a comma seperated string of the transaction hashes of the approved transactions if successful.
* `meta`: the meta search param that was passed by the original URL.
* `errorCode`: The eror code (if any) encountered when signing the transaction.
* `errorMessage`: The error message for the error encountered when signing.