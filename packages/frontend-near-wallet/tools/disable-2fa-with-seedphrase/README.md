## Disable 2fa with seedphrase

This script allows the user to disable NEAR Wallet 2fa using the provided seedphrase

## Prerequisites

* [near-cli](https://github.com/near/near-cli) needs to be installed

## Usage

```shell=
NEAR_WALLET_ENV=mainnet ./disable-2fa-with-seedphrase.sh --accountId="testAccount.near" --seedPhrase='lorem ipsum dolor sit amet consectetur adipiscing elit nunc efficitur est'
```