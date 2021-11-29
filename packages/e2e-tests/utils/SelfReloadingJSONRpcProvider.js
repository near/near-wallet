const { JsonRpcProvider } = require("near-api-js/lib/providers");
const { BN } = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

const { createAccountWithHelper } = require("../services/contractHelper");
const E2eTestAccount = require("./E2eTestAccount");
const { generateTestAccountId, getWorkerAccountRegex } = require("./helpers");
const nearApiJsConnection = require("./connectionSingleton");
const { getTestAccountSeedPhrase } = require("./helpers");

class SelfReloadingJSONRpcProvider extends JsonRpcProvider {
    constructor(...args) {
        super(...args);
        this.isReloading = false;
    }
    sendTransaction(signedTransaction) {
        return super.sendTransaction.call(this, signedTransaction).catch(async (e) => {
            if (e.type === "NotEnoughBalance" && !this.isReloading) {
                this.isReloading = true;
                if (getWorkerAccountRegex(process.env.TEST_WORKER_INDEX).test(signedTransaction.transaction.signerId)) {
                    await SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId);
                    process.env.workerBankStartBalance = new BN(process.env.workerBankStartBalance)
                        .add(new BN(parseNearAmount("200")))
                        .toString();
                } else {
                    await SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId);
                }
                return super.sendTransaction.call(this, signedTransaction);
            }
            if (!this.isReloading) {
                throw e;
            }
        });
    }
    static async reloadAccount(accountId) {
        const randomSubaccountId = `${generateTestAccountId()}.${nearApiJsConnection.config.networkId}`;
        const randomSubaccountSeedphrase = getTestAccountSeedPhrase(randomSubaccountId);
        await createAccountWithHelper(randomSubaccountId, randomSubaccountSeedphrase);
        const randomAccount = await new E2eTestAccount(randomSubaccountId, randomSubaccountSeedphrase, {
            accountId: nearApiJsConnection.config.networkId,
        }).initialize();
        return randomAccount.nearApiJsAccount.deleteAccount(accountId);
    }
}

module.exports = SelfReloadingJSONRpcProvider;
