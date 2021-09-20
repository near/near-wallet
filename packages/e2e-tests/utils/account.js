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
    await account.initialize();
    return account;
};

function generateTestAccountId() {
    return `test-playwright-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
}

// Create random accounts for linkdrop sender, receiver and contract account and deploy linkdrop contract to the contract account
// The random accounts are created as subaccounts of BANK_ACCOUNT
// fail the test suite at this point if one of the accounts fails to create
const setupLinkdropAccounts = (linkdropNEARAmount) =>
    getBankAccount()
        .then((bankAccount) =>
            Promise.all([
                bankAccount.spawnRandomSubAccountInstance().create({ amount: "7.0" }),
                fetchLinkdropContract().then((contractWasm) =>
                    bankAccount.spawnRandomSubAccountInstance().create({ amount: "5.0", contractWasm })
                ),
                bankAccount.spawnRandomSubAccountInstance().create(),
                Promise.resolve(KeyPairEd25519.fromRandom()),
            ])
        )
        .then(([linkdropSenderAccount, linkdropContractAccount, linkdropReceiverAccount, { publicKey, secretKey }]) =>
            linkdropSenderAccount.nearApiJsAccount
                .functionCall(
                    linkdropContractAccount.accountId,
                    "send",
                    { public_key: publicKey.toString() },
                    null,
                    new BN(parseNearAmount(linkdropNEARAmount))
                )
                .then(() => ({
                    linkdropSenderAccount,
                    linkdropContractAccount,
                    linkdropReceiverAccount,
                    secretKey,
                }))
        );

module.exports = {
    getBankAccount,
    generateTestAccountId,
    E2eTestAccount,
    setupLinkdropAccounts,
};
