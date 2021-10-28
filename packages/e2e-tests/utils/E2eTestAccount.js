const {
    utils: {
        format: { parseNearAmount },
    },
} = require("near-api-js");
const BN = require("bn.js");

const nearApiJsConnection = require("./connectionSingleton");
const { getKeyPairFromSeedPhrase, generateTestAccountId } = require("./helpers");
const { getTestAccountSeedPhrase } = require("./helpers");

class E2eTestAccount {
    constructor(accountId, seedPhrase, parentNearApiJsAccount) {
        this.accountId = accountId;
        this.seedPhrase = seedPhrase;
        this.parentNearApiJsAccount = parentNearApiJsAccount;
        this.isCreated = false;
    }
    async initialize() {
        await nearApiJsConnection.setKeyPairFromSeedPhrase({ accountId: this.accountId, seedPhrase: this.seedPhrase });
        await this.connectToNearApiJs();
        return this;
    }
    async connectToNearApiJs() {
        const near = await nearApiJsConnection.getConnection();
        this.nearApiJsAccount = await near.account(this.accountId);
    }
    async create({ amount, contractWasm } = { amount: "1.0" }) {
        if (contractWasm) {
            await this.parentNearApiJsAccount.createAndDeployContract(
                this.accountId,
                getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
                contractWasm,
                parseNearAmount(amount)
            );
        } else {
            await this.parentNearApiJsAccount.createAccount(
                this.accountId,
                getKeyPairFromSeedPhrase(this.seedPhrase).publicKey,
                parseNearAmount(amount)
            );
        }
        this.isCreated = true;
        return this.initialize();
    }
    connectOrCreate(...creationArgs) {
        return this.initialize().catch((e) => {
            if (new RegExp(`${this.accountId} does not exist while viewing`).test(e.message)) {
                return this.create(...creationArgs);
            } else {
                throw e;
            }
        });
    }
    spawnRandomSubAccountInstance() {
        if (!this.nearApiJsAccount) {
            throw new Error("Account needs to be initialized to spawn sub accounts");
        }
        const randomSubaccountId = `${generateTestAccountId()}.${this.accountId}`;
        const randomSubaccountSeedphrase = getTestAccountSeedPhrase(randomSubaccountId);
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
    async getAmountStakedWithValidator(validatorAccountId) {
        const balanceString = await this.nearApiJsAccount.viewFunction(validatorAccountId, "get_account_staked_balance", {
            account_id: this.accountId,
        });
        return new BN(balanceString);
    }
}

module.exports = E2eTestAccount;
