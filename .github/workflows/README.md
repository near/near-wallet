# MyNearWallet CICD

[![Build Status](https://travis-ci.com/near/near-wallet.svg?branch=master)](https://travis-ci.com/near/near-wallet)

## DEPLOY TRIGGERS: 
On push to mainnet - deploy to app.mynearwallet.com --- deploy-mnw-mainnet.yml

On push to testnet - deploy to testnet.mynerawallet.com --- deploy-mnw-testnet.yml

On push to master - deploy to *-staging.mynearwallet.com --- deploy-staging.yml

On PR to master - deploy *-preview.mynearwallet.com  --- pull-request.yml
