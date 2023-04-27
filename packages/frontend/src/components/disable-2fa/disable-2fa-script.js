import { Connection, KeyPair } from 'near-api-js';
import { Account2FA } from 'near-api-js/lib/account_multisig';
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores';
import  { parseSeedPhrase } from 'near-seed-phrase';

const Environments = require('../../../../../features/environments.json');


export async function disable2faTest( accountId, seedPhrase , helperUrl, cleanupState ) {
// eslint-disable-next-line
    const networkId = process.env.NEAR_WALLET_ENV || 'mainnet';
    console.log('networkId', networkId);
    const walletEnvConfigMap = {
        [Environments.TESTNET]: {
            helperUrl: 'https://near-contract-helper.onrender.com',
            rpcUrl: 'https://rpc.nearprotocol.com',
        },
        [Environments.MAINNET]: {
            helperUrl: 'https://helper.mainnet.near.org',
            rpcUrl: 'https://rpc.mainnet.near.org',
        },
    };
    const walletEnvConfig = walletEnvConfigMap[networkId];
    const keyStore = new InMemoryKeyStore();
    
    await keyStore.setKey(networkId, accountId, KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey));
    const connection = Connection.fromConfig({
        networkId,
        provider: {
            type: 'JsonRpcProvider',
            args: { url: walletEnvConfig.rpcUrl },
        },
        signer: { type: 'InMemorySigner', keyStore },
    });

    
    const emptyContractBytes = new Uint8Array(
        await (
            await fetch('https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true')
        ).arrayBuffer()
    );

    
    let cleanupContractBytes;
    if (cleanupState) {
        cleanupContractBytes = new Uint8Array(
            await (
                await fetch('https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true')
            ).arrayBuffer()
        );
    }

    const account = new Account2FA(connection, accountId, {
        helperUrl: helperUrl || walletEnvConfig.helperUrl,
    });


    await account.disableWithFAK({ contractBytes: emptyContractBytes, cleanupContractBytes });
}
