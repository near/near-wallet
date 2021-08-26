const {
    connect,
    keyStores: { InMemoryKeyStore },
    utils: {
        KeyPair,
        format: { parseNearAmount },
    },
} = require("near-api-js");
const { parseSeedPhrase } = require("near-seed-phrase");

const getWalletNetwork = () => process.env.WALLET_NETWORK || "testnet";

const getDefaultConfig = () => ({
    networkId: getWalletNetwork(),
    nodeUrl: process.env.NODE_URL || "https://rpc.testnet.near.org",
    walletUrl: process.env.WALLET_URL || "https://wallet.testnet.near.org",
    keyStore: new InMemoryKeyStore(),
});

function getKeyPairFromSeedPhrase(seedPhrase) {
    return KeyPair.fromString(parseSeedPhrase(seedPhrase).secretKey);
}

function generateTestAccountId() {
    return `test-playwright-account-${Date.now()}-${
        Math.floor(Math.random() * 1000) % 1000
    }`;
}

async function connectToAccountWithSeedphrase(accountId, seedPhrase) {
    const config = getDefaultConfig();
    const testAccountKeyPair = getKeyPairFromSeedPhrase(seedPhrase);
    await config.keyStore.setKey(
        config.networkId,
        accountId,
        testAccountKeyPair
    );

    const near = await connect(config);
    return near.account(accountId);
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
    const config = getDefaultConfig();

    const parentAccountKeyPair = getKeyPairFromSeedPhrase(
        parentAccountSeedphrase
    );
    await config.keyStore.setKey(
        config.networkId,
        parentAccountId,
        parentAccountKeyPair
    );

    const testAccountKeyPair = getKeyPairFromSeedPhrase(testAccountSeedphrase);
    await config.keyStore.setKey(
        config.networkId,
        testAccountId,
        testAccountKeyPair
    );

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
        getAccountInstance: () => near.account(testAccount.accountId),
    };
}

module.exports = {
    createRandomBankSubAccount,
    generateTestAccountId,
    connectToAccountWithSeedphrase,
    getKeyPairFromSeedPhrase,
    getWalletNetwork
};
