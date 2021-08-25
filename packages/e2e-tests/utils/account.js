const {
    connect,
    keyStores: { InMemoryKeyStore },
    utils: {
        KeyPair,
        format: { parseNearAmount },
    },
} = require("near-api-js");
const { parseSeedPhrase } = require("near-seed-phrase");

const getDefaultConfig = () => ({
    networkId: "default",
    nodeUrl: process.env.NODE_URL || "https://rpc.testnet.near.org",
    walletUrl: process.env.WALLET_URL || "https://wallet.testnet.near.org",
    keyStore: new InMemoryKeyStore(),
});

function getKeyPairFromSeedPhrase(seedPhrase) {
    return KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey)
}

function generateTestAccountId() {
    return `test-account-${Date.now()}-${
        Math.floor(Math.random() * 1000) % 1000
    }`;
}

async function createRandomBankSubAccount() {
    return await createBankSubAccount(generateTestAccountId());
}

async function createBankSubAccount(accountId) {
    const {
        BANK_ACCOUNT: parentAccountId,
        BANK_SEED_PHRASE: parentAccountSeedphrase,
        TEST_ACCOUNT_SEED_PHRASE,
    } = process.env;

    const testAccountId = `${accountId}.${parentAccountId}`;
    const testAccountSeedphrase = `${testAccountId} ${TEST_ACCOUNT_SEED_PHRASE}`;
    const config = getDefaultConfig(parentAccountId);

    const parentAccountKeyPair = getKeyPairFromSeedPhrase(
        parentAccountSeedphrase
    );
    await config.keyStore.setKey(
        config.networkId,
        parentAccountId,
        parentAccountKeyPair
    );

    const testAccountKeyPair = getKeyPairFromSeedPhrase(
        testAccountSeedphrase
    );
    await config.keyStore.setKey(config.networkId, testAccountId, testAccountKeyPair);

    const near = await connect(config);
    const parentAccount = await near.account(parentAccountId);
    await parentAccount.createAccount(
        testAccountId,
        testAccountKeyPair.publicKey,
        parseNearAmount("1.0")
    );

    const testAccount = await near.account(testAccountId);

    return {
        account: testAccount,
        seedPhrase: testAccountSeedphrase,
        delete: async () =>
            await testAccount.deleteAccount(parentAccount.accountId),
    };
}

module.exports = {
    createRandomBankSubAccount
};
