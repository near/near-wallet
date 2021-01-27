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

async function createIncident(accountId, error) {
    const { api } = require('@pagerduty/pdjs');

    const pd = api({ token: process.env.PAGERDUTY_API_KEY });

    console.log('Creating incident on PagerDuty')
    await pd.post('/incidents', {
        data: {
            incident: {
                type: "incident",
                title: "wallet e2e-tests failure",
                service: {
                    id: "PJ9TV6C", // wallet
                    type: "service_reference"
                },
                assignments: [
                    {
                        assignee: {
                            id: "PM9MK7I", // vlad@near.org
                            type: "user_reference"
                        }
                    }
                ],
                body: {
                    type: "incident_body",
                    details: `
Wallet e2e-tests suite has failed. See https://dashboard.render.com/cron/crn-bvrt6tblc6ct62bdjmig/logs for details.
Make sure that account recovery works well on https://wallet.near.org.

${accountId ? `Test account to check https://explorer.near.org/accounts/${accountId}` : ''}

${error.stack}
                    `
                }
            },
        }
    });
}

let lastTestAccountId;

(async () => {
    const near = await connect(config);
    const { keyStore } = config;
    const bankKeyPair = KeyPair.fromString((await parseSeedPhrase(BANK_SEED_PHRASE)).secretKey);
    await keyStore.setKey(NETWORK_ID, BANK_ACCOUNT, bankKeyPair);
    const bankAccount = await near.account(BANK_ACCOUNT);

    async function createTestAccount() {
        const accountId = `test-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}.${bankAccount.accountId}`;
        console.log('createTestAccount', accountId);
        const seedPhrase = `${accountId} ${TEST_ACCOUNT_SEED_PHRASE}`;
        const { secretKey } = await parseSeedPhrase(seedPhrase);
        // TODO: Use the same seed phrase for all accounts to test recovery not picking up deleted accounts
        const keyPair = KeyPair.fromString(secretKey);
        await keyStore.setKey(NETWORK_ID, accountId, keyPair);
        await bankAccount.createAccount(accountId, keyPair.publicKey, parseNearAmount('1.0'));
        lastTestAccountId = accountId;
        return near.account(accountId);
    }

    const testAccount1 = await createTestAccount()
    try {
        const browser = await webkit.launch({ headless: HEADLESS });
        const page = await browser.newPage();
        await page.goto(config.walletUrl + '/recover-seed-phrase');
        const seedPhrase = `${testAccount1.accountId} ${TEST_ACCOUNT_SEED_PHRASE}`;
        await page.fill('[name=seedPhrase]', seedPhrase);
        await page.click('[type=submit]');
        await page.waitForNavigation();
        assert(page.url() == config.walletUrl + '/');
        assert.strictEqual(await page.textContent('.user-name'), testAccount1.accountId);
        await browser.close();
    } finally {
        console.log('Removing', testAccount1.accountId);
        await testAccount1.deleteAccount(bankAccount.accountId);
    }
})().catch(async e => {
    console.error(e);

    await createIncident(lastTestAccountId, e);
    process.exit(1);
});