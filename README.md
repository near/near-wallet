# NEAR Wallet

[![Build Status](https://travis-ci.com/near/near-wallet.svg?branch=master)](https://travis-ci.com/near/near-wallet)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/near/near-wallet)

This is in-browser web-based wallet for working with NEAR accounts. This wallet stores account keys in open text using the localStorage on user's machine.

WARNING: This wallet shouldn't be used as the only signer for high-value accounts. Make sure to use hardware wallet when substantial amount of NEAR tokens is involved.

## PACKAGES
### [e2e-tests](packages/e2e-tests)
Test suite for verifying core use cases and user flow are functional in the UI
### [frontend](packages/frontend)
Wallet frontend (React/Redux app).