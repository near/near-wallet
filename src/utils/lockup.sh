#!/bin/bash

echo Downloading Lockup Contract ...

curl --header 'Accept: application/vnd.github.v3.raw' \
     --remote-name \
     --location https://github.com/near/core-contracts/blob/master/lockup/res/lockup_contract.wasm?raw=true

mv lockup_contract.wasm?raw=true lockup_contract.wasm

owner="$1"

echo Creating Lockup Account with Owner $owner

timestamp=$(date +%s)
testaccount=testinglockup.$owner
near create-account $testaccount --masterAccount $owner --initialBalance 50

echo Deploying Contract

near deploy --accountId $testaccount --wasmFile lockup_contract.wasm --initFunction=new --initArgs='{"owner_account_id":"'$owner'","lockup_duration": "259200000000000","transfers_information":{"TransfersDisabled":{"transfer_poll_account_id":"vote.f863973.m0"}},"release_duration":"2592000000000000","staking_pool_whitelist_account_id":"whitelist.f863973.m0"}' 

near send $owner $testaccount 445

echo Successfully Deployed Lockup with Owner $owner
echo Staking TESTNET URL https://near-wallet-pr-936.onrender.com/
echo Staking BETANET URL https://betanet-wallet-pr-936.onrender.com/
echo Please login to NEAR Wallet with account $owner
