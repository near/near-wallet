# Linkdrops

[What is a linkdrop](#what-is-a-linkdrop)
[Creating a linkdrop](#creating-a-linkdrop)
[Wallet linkdrop page](#wallet-linkdrop-page)

## What is a linkdrop?

Linkdrops allow you to send funds to anyone via a link. The reciever of a linkdrop can add the funds to their existing account or create a new account to claim the funds.

![](https://i.imgur.com/P5WMg1i.png)


## Creating a linkdrop
1. Generate a `KeyPair`.
2. Call the `send` method of an account that has a [linkdrop contract](https://github.com/near/near-linkdrop) deployed with the `publicKey` an attached amount of NEAR you want to send*.
3. Use the `secretKey` as the `fundingKey` in the link.

Example:
```javascript=
const fundingContractAccountId = "near";
const linkdropKeyPair = KeyPairEd25519.fromRandom();
await linkdropSenderAccount.functionCall(
            fundingContractAccountId,
            "send",
            { public_key: linkdropKeyPair.publicKey.toString() },
            null,
            new BN(parseNearAmount("2.5"))
        );
console.log(`https://wallet.near.org/${fundingContractAccountId}/${linkdropKeyPair.secretKey}`);
```

*The [linkdrop contract](https://github.com/near/near-linkdrop) deducts 1Ⓝ when calling `send` to cover account creation via an access key.

## Wallet linkdrop page

     /linkdrop/{fundingContractAccountId}/{linkdropKeyPairSecretKey}?redirectUrl={redirectUrl}
    
* `fundingContractAccountId`: The contract accountId that was used to send the funds.
* `linkdropKeyPairSecretKey`: The corresponding secret key to the public key sent to the contract.
* `redirectUrl`: The url that wallet will redirect to after funds are successfully claimed to an existing account. The URL is sent the accountId used to claim the funds as a query param.