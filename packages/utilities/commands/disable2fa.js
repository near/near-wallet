const { InMemoryKeyStore } = require("near-api-js/lib/key_stores");
const { parseSeedPhrase } = require("near-seed-phrase");
const { Connection, KeyPair } = require("near-api-js");

const Environments =  require("../../../features/environments.json");
const { Account2FA } = require("near-api-js/lib/account_multisig");
1
module.exports = {
  command: `disable-2fa`,
  builder: (yargs) =>
      yargs
          .option("accountId", {
              desc: "accountId to disable the 2fa on",
              type: "string",
              required: true,
          })
          .option("seedPhrase", {
              desc: "seedPhrase for the accountId",
              type: "string",
              required: true,
          })
          .option("cleanupState", {
              desc: `cleanup account state on disable`,
              type: "boolean",
              required: false,
          })
          .option("helperUrl", {
              desc: `helperUrl to use`,
              type: "string",
              required: false,
          }),
  handler: disable2fa,
}

async function disable2fa({ accountId, seedPhrase, helperUrl, cleanupState }) {
  const networkId = process.env.NEAR_WALLET_ENV || 'mainnet';
  const walletEnvConfigMap = {
      [Environments.TESTNET]: {
          helperUrl: "https://near-contract-helper.onrender.com",
          rpcUrl: "https://rpc.nearprotocol.com",
      },
      [Environments.MAINNET]: {
          helperUrl: "https://helper.mainnet.near.org",
          rpcUrl: "https://rpc.mainnet.near.org",
      },
  };
  const walletEnvConfig = walletEnvConfigMap[networkId];
  const keyStore = new InMemoryKeyStore();
  await keyStore.setKey(networkId, accountId, KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey));
  const connection = Connection.fromConfig({
      networkId,
      provider: {
          type: "JsonRpcProvider",
          args: { url: walletEnvConfig.rpcUrl },
      },
      signer: { type: "InMemorySigner", keyStore },
  });

  const emptyContractBytes = new Uint8Array(
      await (
          await fetch("https://github.com/near/near-wallet/blob/master/packages/frontend/src/wasm/main.wasm?raw=true")
      ).arrayBuffer()
  );
  let cleanupContractBytes;
  if (cleanupState ) {
      cleanupContractBytes = new Uint8Array(
          await (
              await fetch("https://github.com/near/core-contracts/blob/master/state-cleanup/res/state_cleanup.wasm?raw=true")
          ).arrayBuffer()
      );
  }

  const account = new Account2FA(connection, accountId, {
      helperUrl: helperUrl || walletEnvConfig.helperUrl,
  });

  await account.disableWithFAK({ contractBytes: emptyContractBytes, cleanupContractBytes });
}