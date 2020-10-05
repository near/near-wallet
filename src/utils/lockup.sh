#!/bin/bash

initialBalance=35
case "$NEAR_ENV" in
    betanet)
        lockupBalance=12
        whitelist=whitelist.betanet
        ;;
    *)
        lockupBalance=460
        whitelist=whitelist.f863973.m0
        ;;
esac

echo "Downloading Lockup Contract ..."

curl --header 'Accept: application/vnd.github.v3.raw' \
     --remote-name \
     --location https://github.com/near/core-contracts/blob/master/lockup/res/lockup_contract.wasm?raw=true

mv lockup_contract.wasm?raw=true lockup_contract.wasm

owner="$1"

echo "Creating Lockup Account with Owner $owner"

timestamp=$(date +%s)
testaccount=testinglockup.$owner
near create-account $testaccount --masterAccount $owner --initialBalance $initialBalance

echo "Deploying Contract ..."

near deploy --accountId $testaccount --wasmFile lockup_contract.wasm --initFunction=new --initArgs='{"owner_account_id":"'$owner'","lockup_duration": "259200000000000","transfers_information":{"TransfersDisabled":{"transfer_poll_account_id":"vote.f863973.m0"}},"release_duration":"2592000000000000","staking_pool_whitelist_account_id":"'$whitelist'"}'

near send $owner $testaccount $lockupBalance

echo "Successfully Deployed Lockup Account $testaccount"
echo "with Owner $owner"
case "$NEAR_ENV" in
    betanet) echo "Visit https://betanet-wallet-pr-936.onrender.com/recover-account" ;;
    *) echo "Visit https://near-wallet-pr-936.onrender.com/recover-account" ;;
esac
echo "and login to account $owner"
