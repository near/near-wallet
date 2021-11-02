const base = require("@playwright/test");
const { BN } = require("bn.js");

const { WALLET_NETWORK } = require("./constants");
const { getBankAccount } = require("./utils/account");
const nearApiJsConnection = require("./utils/connectionSingleton");
const E2eTestAccount = require("./utils/E2eTestAccount");
const { getTestAccountSeedPhrase, getWorkerAccountId } = require("./utils/helpers");
const SelfReloadingE2eTestAccount = require("./utils/SelfReloadingE2eTestAccount");

module.exports = base;

module.exports.test = base.test.extend({
    bankAccount: [
        async ({}, use, workerInfo) => {
            const bankAccount = await getBankAccount();
            const workerBankAccountId = getWorkerAccountId(workerInfo.workerIndex);
            const workerBankAccountSeedphrase = getTestAccountSeedPhrase(workerBankAccountId);
            const workerBankAccount = await new (nearApiJsConnection.config.networkId !== WALLET_NETWORK.MAINNET
                ? SelfReloadingE2eTestAccount
                : E2eTestAccount)(
                workerBankAccountId,
                workerBankAccountSeedphrase,
                bankAccount.nearApiJsAccount
            ).connectOrCreate();
            const { total: startBalance } = await workerBankAccount.getUpdatedBalance();
            process.env.workerBankStartBalance = startBalance;
            await use(workerBankAccount);
            const { total: endBalance } = await workerBankAccount.getUpdatedBalance();
            const amountSpent = new BN(process.env.workerBankStartBalance).sub(new BN(endBalance)).toString();
            console.log(
                JSON.stringify([
                    "WorkerExpenseLog",
                    { workerBankAccount: workerBankAccount.accountId, amountSpent, workerIndex: workerInfo.workerIndex },
                ])
            );
        },
        { scope: "worker", auto: true },
    ],
});
