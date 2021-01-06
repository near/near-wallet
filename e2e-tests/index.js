const {
    connect,
    keyStores: { InMemoryKeyStore },
    utils: {
        KeyPair,
        format: { parseNearAmount }
    }
} = require('near-api-js');
const { parseSeedPhrase, generateSeedPhrase } = require('near-seed-phrase');
const { webkit } = require('playwright');

const assert = require('assert');

const NETWORK_ID = 'default';
const BANK_SEED_PHRASE = process.env.BANK_SEED_PHRASE;
const BANK_ACCOUNT = process.env.BANK_ACCOUNT;
const TEST_ACCOUNT_SEED_PHRASE = process.env.TEST_ACCOUNT_SEED_PHRASE;
const HEADLESS = !['no', 'false'].includes(process.env.HEADLESS);

const config = {
    networkId: NETWORK_ID,
    nodeUrl: process.env.NODE_URL || 'https://rpc.testnet.near.org',
    walletUrl: process.env.WALLET_URL || 'https://wallet.testnet.near.org',
    keyStore: new InMemoryKeyStore()
};

(async () => {
    const near = await connect(config);
    const { keyStore } = config;
    const bankKeyPair = KeyPair.fromString((await parseSeedPhrase(BANK_SEED_PHRASE)).secretKey);
    await keyStore.setKey(NETWORK_ID, BANK_ACCOUNT, bankKeyPair);
    const bankAccount = await near.account(BANK_ACCOUNT);

    async function createTestAccount() {
        const accountId = `test-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
        console.log('createTestAccount', accountId);
        const { secretKey } = await parseSeedPhrase(TEST_ACCOUNT_SEED_PHRASE);
        const keyPair = KeyPair.fromString(secretKey);
        await keyStore.setKey(NETWORK_ID, accountId, keyPair);
        await bankAccount.createAccount(accountId, keyPair.publicKey, parseNearAmount('1.0'));
        return near.account(accountId);
    }

    const testAccount1 = await createTestAccount()
    try {
        const browser = await webkit.launch({ headless: HEADLESS });
        const page = await browser.newPage();
        await page.goto(config.walletUrl + '/recover-seed-phrase');
        await page.fill('[name=seedPhrase]', TEST_ACCOUNT_SEED_PHRASE);
        await page.click('[type=submit]');
        await page.waitForNavigation();
        assert(page.url() == config.walletUrl + '/');
        assert.strictEqual(await page.textContent('.user-name'), testAccount1.accountId);
        await browser.close();
    } finally {
        console.log('Removing', testAccount1.accountId);
        await testAccount1.deleteAccount(bankAccount.accountId);
    }
})().catch(e => {
    console.error(e);
    process.exit(1);
});