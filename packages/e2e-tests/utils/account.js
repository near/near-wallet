const {
    connect,
    utils: {
        format: { parseNearAmount },
    },
} = require("near-api-js");

const nearApiJsConnection = require("./connectionSingleton");
const { getKeyPairFromSeedPhrase } = require("./helpers");

class E2eTestAccount {
    constructor(accountId, seedPhrase, parentNearApiJsAccount) {
        this.accountId = accountId;
        this.seedPhrase = seedPhrase;
        this.parentNearApiJsAccount = parentNearApiJsAccount;
    }
    async initialize() {
        await nearApiJsConnection.setKeyPairFromSeedPhrase(this);
        await this.connectToNearApiJs();
        return this;
    }
    async connectToNearApiJs() {
        const near = await nearApiJsConnection.getConnection();
        this.nearApiJsAccount = await near.account(this.accountId);
    }
    async create({ amount } = { amount: "1.0" }) {
        await this.parentNearApiJsAccount.createAccount(
            this.accountId,
            getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
            parseNearAmount(amount)
        );
        this.isCreated = true;
        await this.initialize();
        return this;
    }
    spawnRandomSubAccountInstance() {
        if (!this.nearApiJsAccount) {
            throw new Error("Account needs to be initialized to spawn sub accounts");
        }
        const randomSubaccountId = generateTestAccountId();
        const randomSubaccountSeedphrase = `${randomSubaccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
        return new E2eTestAccount(randomSubaccountId, randomSubaccountSeedphrase, this.nearApiJsAccount);
    }
    async delete() {
        if (this.isCreated) {
            // this will not allow deletion of existing accounts connected to from here, only created accounts
            await this.nearApiJsAccount.deleteAccount(this.parentNearApiJsAccount.accountId);
        }
    }
    async getUpdatedBalance() {
        await this.connectToNearApiJs();
        return this.nearApiJsAccount.getAccountBalance();
    }
}

function generateTestAccountId() {
    return `test-playwright-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
}

const getBankAccount = async () => {
    const { BANK_ACCOUNT: accountId, BANK_SEED_PHRASE: seedPhrase } = process.env;
    const account = new E2eTestAccount(accountId, seedPhrase, { accountId: nearApiJsConnection.config.networkId });
    await account.initialize();
    return account;
};

module.exports = {
    getBankAccount,
    generateTestAccountId,
    E2eTestAccount,
};
