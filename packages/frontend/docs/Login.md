Wallet Login
===

To implement authentication using the NEAR Wallet, you will need to follow the instructions provided below.

## Prerequisites
* You should already have `near-api-js` installed.

## Steps
1. [Construct wallet login parameters](#construct-wallet-login-parameters)
2. [Initialize a `WalletConnection` and call `requestSignIn`](#initialize-a-walletconnection-and-call-requestsignin)
3. [Wallet redirect on success on failure](#wallet-redirect-on-success-on-failure)

<br/>

## Construct wallet login parameters
The wallet login API accepts 1 parameter as shown below:

| Command | Type | Required | Description
| --- | --- | --- | --- |
| contractIdOrOptions | SignInOptions | `true` |A configuration object for the request as shown below. |


```typescript
   // The configuration for SignInOptions 
    interface SignInOptions {
        // The ID of the smart contract requesting access
        contractId?: string;
        // And array of contract methods (Leave empty for access to all methods)
        methodNames?: string[];
        // NEAR wallet will redirect to this URL on sign in success 
        successUrl?: string;
        // NEAR wallet will redirect to this URL on sign in failure 
        failureUrl?: string;
    }
```

### Note
* If you wish to request full access to the wallet, do not pass a `contractId` field to signup options.


<br/>

## Initialize a `WalletConnection` and call `requestSignIn`

Setup a `WalletConnection` instance by passing in your `Near` instance. You can then call the `requestSignIn` method on the `WalletConnection` instance to redirect the user to the wallet for approval. 

```typescript

    const nearAPI = require("near-api-js");
    const { connect, WalletConnection } = nearApi;
    const near = await connect(config);
    const walletConnection = new WalletConnection(near);

    const contractId = 'example.testnet';
    const successUrl = 'https://demodapp.com/auth/success';
    const failureUrl = 'https://demodapp.com/auth/failure';

    walletConnection.requestSignIn({ contractId, successUrl, failureUrl });

```

<br/>

## Wallet redirect on success on failure
Once sign in is successfully initiated, the user will be taken to the wallet where they will be presented with a screen to grant access to the contract (see image below).


<img src="./assets/login-request.png" width="500">

<br/>

Once the user allows or denies the request, they will be redirected to the `successUrl` and `failureUrl`  respectively,with the following parameters:

* `account_id` - The ID of the authenticated wallet.
* `all_keys` - A comma separated, concatenated string of available keys on the wallet. 
* `public_key` -  The public key supplied. 


<br/>

## Related Resources:
* [Near API Docs | Wallet](https://docs.near.org/docs/api/naj-quick-reference#wallet)