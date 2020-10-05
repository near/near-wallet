near deploy --accountId whitelist.betanet --wasmFile whitelist.wasm --initFunction=new --initArgs='{"foundation_account_id":"whitelist.betanet"}' 

// with repl 

NEAR_ENV=betanet near repl --accountId whitelist.betanet

await account.signAndSendTransaction('whitelist.betanet', [nearAPI.transactions.functionCall('add_staking_pool', new Uint8Array(new TextEncoder().encode(JSON.stringify({ staking_pool_account_id: 'chorus-one-pool-v1.stakehouse.betanet' }))), '100000000000000', '0')])