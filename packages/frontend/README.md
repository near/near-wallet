# NEAR Wallet

[![Build Status](https://travis-ci.com/near/near-wallet.svg?branch=master)](https://travis-ci.com/near/near-wallet)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/near/near-wallet) 

This is in-browser web-based wallet for working with NEAR accounts. This wallet stores account keys in open text using the localStorage on user's machine.

WARNING: This wallet shouldn't be used as the only signer for high-value accounts. Make sure to use hardware wallet when substantial amount of NEAR tokens is involved.

Getting started
===

First ensure there is a value for the `NEAR_WALLET_ENV` environment variable. This can be set in `packages/frontend/.env` prior to bundling.
The set of valid values for `NEAR_WALLET_ENV` are the JSON values defined in [environments.json](../../features/environments.json) (e.g. `NEAR_WALLET_ENV=development`).

To build locally, run the following command in the `/frontend` directory. Substitute `testnet` for the desired environment
as outlined above.

`yarn && NEAR_WALLET_ENV=testnet yarn start`

The environment must be set at bundle time rather than run time. If you wish to run the frontend package with a different
environment, please run `yarn prebuild` first.

Testing
===

To run tests:

`yarn test`

## License
This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
