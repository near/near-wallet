# NEAR DevNet Wallet

[![Build Status](https://travis-ci.com/nearprotocol/near-wallet.svg?branch=master)](https://travis-ci.com/nearprotocol/near-wallet)

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
