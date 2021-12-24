Wallet Login
===

To implement authentication using the NEAR Wallet, you will need to follow the instructions provided below.

## Prerequisites
* You should already have `near-api-js` installed.

## Steps
1. Construct wallet login parameters
2. Initialize a `WalletConnection` and call `requestSignIn`
3. Wallet redirect on success on failure

<br/>

### Construct wallet login parameters
The wallet login API accepts the following parameters:

```typescript
    // A string indicating
    contractIdOrOptions: string | SignInOptions = {},
    // A string identifier for the app requesting access
    title?: string,
    // NEAR wallet will redirect to this URL on sign in success 
    successUrl?: string,
    // NEAR wallet will redirect to this URL on sign in failure 
    failureUrl?: string

    interface SignInOptions {
        contractId?: string;
        methodNames?: string[];
        successUrl?: string;
        failureUrl?: string;
    }
```

TODO: public_key? For full access?


<br/>

## Initialize a `WalletConnection` and call `requestSignIn`

Setup a `WalletConnection` instance by passing in your `Near` instance. You can then call the `requestSignIn` method on the `WalletConnection` instance to redirect the user to the wallet for approval. 

```typescript

    const nearAPI = require("near-api-js");
    const { connect, WalletConnection } = nearApi;
    const near = await connect(config);
    const walletConnection = new WalletConnection(near);

    const contractId = 'example.testnet';
    const title = 'Demo app'
    const successUrl = 'https://demodapp.com/auth/success'
    const failureUrl = 'https://demodapp.com/auth/failure'

    // redirect to wallet to complete login
    walletConnection.requestSignIn(contractId, title, successUrl, failureUrl);

    // OR

    // Using SignInOptions
    walletConnection.requestSignIn({ contractId }, title, successUrl, failureUrl);

```

<br/>

## Wallet redirect on success on failure
Once sign in is successfully initiated, the user will be taken to the wallet where they will be presented with a screen to grant access(See image below) to the contract.


<img src="./assets/login-request.png" width="500">

<br/>

Once the user allows or denies the request, they will be redirected to the `successUrl` and `failureUrl  respectively,with the following parameters:

* `account_id`
* `all_keys`


<br/>

## Related Resources:
* [Near API Docs | Wallet](https://docs.near.org/docs/api/naj-quick-reference#wallet)