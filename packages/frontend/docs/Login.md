Wallet Login
===

To implement authentication using the NEAR Wallet, you will need to follow the instructions provided below.

## Prerequisites
* You should already have `near-api-js` installed.

## Steps
1. [Construct wallet login parameters](#construct-wallet-login-parameters)
2. [Initialize a `WalletConnection` and call `requestSignIn`](#initialize-a-walletconnection-and-call-requestsignin)
3. [Wallet redirect on success on failure](#wallet-redirect-on-success-on-failure)
4. [Retrieving the logged in user](#retrieving-the-logged-in-user)

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
    const wallet = new WalletConnection(near);

    const contractId = 'example.testnet';
    const successUrl = 'https://demodapp.com/auth/success';
    const failureUrl = 'https://demodapp.com/auth/failure';

    wallet.requestSignIn({ contractId, successUrl, failureUrl });

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

## Retrieving the logged in user
Once a user is logged in, you can retrieve the account ID of the authorized wallet using the `getAccountId` method as shown below.


```typescript

    const nearAPI = require("near-api-js");
    const { connect, WalletConnection } = nearApi;
    const near = await connect(config);
    const wallet = new WalletConnection(near);

    const signedInWalletId = wallet.getAccountId();

```


<br/>

## Wallet URL API

The `/login` path of the wallet recognizes the following url parameters:

| Param | Description
| --- | --- |
| `contract_id` | The account ID of the contract to be accessed with the key |
| `public_key` | The corresponding public key to the private key that will be granted access |
| `failure_url` | The url to redirect to if the request is denied |
| `success_url` | The url to redirect to if the request is successful |
| `methodNames` | The `methodNames` that will be accessible with the key  |

When requesting an access key (full or function call), a key pair is generated and the public key is sent to the wallet under the `public_key` parameter along with other information about the request.

### Requesting a function call access key

To request a function call access key, the `contract_id` parameter is set to the target contract account ID and the `methodNames` parameter is set to any methods on the contract the access key should be limited to. If left blank the access key will be able to call all methods on the contract.

```
GET https://wallet.testnet.near.org/login?public_key=ed25519%3A4Y1rQKB8STnPBWVo29mRc3Z5ByJwg1FLmX6EMzisVAa4&contract_id=v2.test-contract.testnet
```

### Requesting a full access key

To request a full access key, omit the `contract_id` or use the target approving user's account ID as `contract_id`.

```
GET https://wallet.testnet.near.org/login?public_key=ed25519%3A4Y1rQKB8STnPBWVo29mRc3Z5ByJwg1FLmX6EMzisVAa4
```

The wallet will then redirect to either `success_url` or `failure_url` (see [wallet redirect](#wallet-redirect-on-success-on-failure)) and transactions can be signed using the private key of the key pair on behalf of the user.

## Related Resources:
* [Near API Docs | Wallet](https://docs.near.org/docs/api/naj-quick-reference#wallet)
