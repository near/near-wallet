# NEAR DevNet Wallet

[![Build Status](https://travis-ci.com/nearprotocol/near-wallet.svg?branch=master)](https://travis-ci.com/nearprotocol/near-wallet)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nearprotocol/near-wallet) 

This is in-browser web-based wallet for working with NEAR accounts. This wallet stores account keys in open text using the localStorage under https://wallet.nearprotocol.com domain on user's machine.

WARNING: This wallet shouldn't be used as the only signer for high-value accounts. Make sure to use hardware wallet when substantial amount of NEAR tokens is involved.

Getting started
===

To build locally, run this command in the project directory:

`yarn && yarn start`

Testing
===

To run tests:

`yarn test`

## License
This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.
