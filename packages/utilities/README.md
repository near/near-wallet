# Utilities CLI (command line interface)

The uitilites package provides various wallet related command line utilities.

## Overview

_Click on a command for more information and examples._

| Command                                                | Description                                                                                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`disable-2fa`](#disable-2fa)                          | disable 2fa using the provided seedphrase                                                                                              |
| [`restore-account-contract`](#restore-account-contract)| restore account contract to a given `blockHash`                                                                                        |


## Disable 2fa

This script allows the user to disable NEAR Wallet 2fa using the provided seedphrase. It converts 2fa LAKs back to FAKs, deploys the empty contract and optionally cleans up state
* arguments: `accountId` `seedPhrase`
* options: `cleanupState` `helperUrl`

### Usage

```shell=
NEAR_WALLET_ENV=mainnet node index.js disable-2fa --accountId="testAccount.near" --seedPhrase='lorem ipsum dolor sit amet consectetur adipiscing elit nunc efficitur est'
```
---
## Restore account contract

This script restores account code back to a given `blockHash` by deploying a contract. It pulls contract code from the given archival node
* arguments: `accountId` `seedPhrase` `nodeUrl` `blockHash`

### Usage

```shell=
NEAR_WALLET_ENV=testnet node index.js restore-account-contract --accountId='testAccount.testnet' --seedPhrase='lorem ipsum dolor sit amet consectetur adipiscing elit nunc efficitur est' --blockHash='9c5tk9kdTzgAgejgmnLCRu9yJ1Jp1LjFqtgB4SHEzzeB' --nodeUrl='https://sample-archival-testnet-node-url.com/'
```