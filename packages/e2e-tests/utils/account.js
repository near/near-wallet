const nearApiJsConnection = require("./connectionSingleton");
const E2eTestAccount = require("./E2eTestAccount");

const getBankAccount = async () => {
    const { BANK_ACCOUNT: accountId, BANK_SEED_PHRASE: seedPhrase } = process.env;
    const account = new E2eTestAccount(accountId, seedPhrase, { accountId: nearApiJsConnection.config.networkId });
    await account.initialize();
    return account;
};

module.exports = {
    getBankAccount
};
