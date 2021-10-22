const nearApiJsConnection = require("./connectionSingleton");
const E2eTestAccount = require("./E2eTestAccount");
const { WALLET_NETWORK } = require("../constants");
const SelfReloadingE2eTestAccount = require("./SelfReloadingE2eTestAccount");

const getBankAccount = async () => {
    const { BANK_ACCOUNT: accountId, BANK_SEED_PHRASE: seedPhrase } = process.env;
    const account =
        nearApiJsConnection.config.networkId !== WALLET_NETWORK.MAINNET
            ? new SelfReloadingE2eTestAccount(accountId, seedPhrase, { accountId: nearApiJsConnection.config.networkId })
            : new E2eTestAccount(accountId, seedPhrase, { accountId: nearApiJsConnection.config.networkId });
    return account.initialize();
};

function generateTestAccountId() {
    return `test-playwright-account-${Date.now()}-${Math.floor(Math.random() * 1000) % 1000}`;
}

module.exports = {
    getBankAccount,
    generateTestAccountId,
};
