const { InMemoryKeyStore } = require("near-api-js/lib/key_stores");
const { parseSeedPhrase } = require("near-seed-phrase");
const { Connection, KeyPair } = require("near-api-js");
const { Account } = require("near-api-js/lib/account");

module.exports = {
    command: `restore-account-contract`,
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
            .option("nodeUrl", {
                desc: "Url for the archival rpc node to pull the code from",
                type: "string",
                required: true,
            })
            .option("blockHash", {
                desc: `block hash to pull code from and deploy to the account`,
                type: "string",
                required: true,
            }),
    handler: restoreAccountContract,
};

async function restoreAccountContract({ accountId, seedPhrase, nodeUrl, blockHash }) {
    const networkId = process.env.NEAR_WALLET_ENV || "mainnet";

    const keyStore = new InMemoryKeyStore();
    await keyStore.setKey(networkId, accountId, KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey));

    const connection = Connection.fromConfig({
        networkId,
        provider: {
            type: "JsonRpcProvider",
            args: { url: nodeUrl },
        },
        signer: { type: "InMemorySigner", keyStore },
    });

    const { code_base64 } = await connection.provider.query({
        request_type: "view_code",
        account_id: accountId,
        blockId: blockHash,
        finality: 'final'
    });

    const account = new Account(connection, accountId);
    await account.deployContract(new Uint8Array(Buffer.from(code_base64, 'base64')));
}