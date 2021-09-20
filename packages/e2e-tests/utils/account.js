const {
    utils: {
        format: { parseNearAmount },
        KeyPairEd25519,
    },
} = require("near-api-js");
const BN = require("bn.js");

const { fetchLinkdropContract } = require("../contracts");
const nearApiJsConnection = require("./connectionSingleton");
const E2eTestAccount = require("./E2eTestAccount");

const getBankAccount = async () => {
    const { BANK_ACCOUNT: accountId, BANK_SEED_PHRASE: seedPhrase } = process.env;
    const account = new E2eTestAccount(accountId, seedPhrase, { accountId: nearApiJsConnection.config.networkId });
    return account.initialize();
};

class LinkdropAccountManager {
    // Create random accounts for linkdrop sender, receiver and contract account and deploy linkdrop contract to the contract account
    // The random accounts are created as subaccounts of BANK_ACCOUNT
    constructor(bankAccount) {
        this.linkdropSenderAccount = bankAccount.spawnRandomSubAccountInstance();
        this.linkdropContractAccount = bankAccount.spawnRandomSubAccountInstance();
        this.linkdropReceiverAccount = bankAccount.spawnRandomSubAccountInstance();
    }
    async initialize(senderNearBalance) {
        await Promise.all([
            this.linkdropSenderAccount.create({ amount: senderNearBalance }),
            fetchLinkdropContract().then((contractWasm) => this.linkdropContractAccount.create({ amount: "5.0", contractWasm })),
            this.linkdropReceiverAccount.create(),
        ]);
        return this;
    }
    async send(nearAmount) {
        const { publicKey, secretKey } = KeyPairEd25519.fromRandom();
        await this.linkdropSenderAccount.nearApiJsAccount.functionCall(
            this.linkdropContractAccount.accountId,
            "send",
            { public_key: publicKey.toString() },
            null,
            new BN(parseNearAmount(nearAmount))
        );
        this.lastSecretKey = secretKey;
        return secretKey;
    }
    async sendToNetworkTLA(nearAmount) {
        const { publicKey, secretKey } = KeyPairEd25519.fromRandom();
        await this.linkdropSenderAccount.nearApiJsAccount.functionCall(
            nearApiJsConnection.config.networkId,
            "send",
            { public_key: publicKey.toString() },
            null,
            new BN(parseNearAmount(nearAmount))
        );
        return secretKey;
    }
    deleteAccounts() {
        return Promise.allSettled([
            this.linkdropSenderAccount.delete(),
            this.linkdropContractAccount.delete(),
            this.linkdropReceiverAccount.delete(),
        ]);
    }
}

function generateTestAccountId() {
    return `test-playwright-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
}

module.exports = {
    getBankAccount,
    generateTestAccountId,
    LinkdropAccountManager,
};
