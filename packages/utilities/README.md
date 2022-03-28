# Utilities CLI (command line interface)

The uitilites package provides various wallet related command line utilities.

## Overview

_Click on a command for more information and examples._

| Command                                               | Description                                                                                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`disable-2fa`](#disable-2fa)                         | disable 2fa using the provided seedphrase                                                                                              |


## Disable 2fa

This script allows the user to disable NEAR Wallet 2fa using the provided seedphrase

### Usage

```shell=
NEAR_WALLET_ENV=mainnet node index.js disable-2fa --accountId="testAccount.near" --seedPhrase='lorem ipsum dolor sit amet consectetur adipiscing elit nunc efficitur est'
```