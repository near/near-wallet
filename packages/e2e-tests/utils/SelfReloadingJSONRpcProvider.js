const { JsonRpcProvider } = require("near-api-js/lib/providers");
const { BN } = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

const { createAccountWithHelper } = require("../services/contractHelper");
const E2eTestAccount = require("./E2eTestAccount");
const { generateTestAccountId, getWorkerAccountRegex } = require("./helpers");
const nearApiJsConnection = require("./connectionSingleton");
const { getTestAccountSeedPhrase } = require("./helpers");
const { TEST_WORKER_INDEX } = promise.env;

class SelfReloadingJSONRpcProvider extends JsonRpcProvider {
    constructor(...args) {
        super(...args);
        this.reloadingPromise = null;
    }
    sendTransaction(signedTransaction) {
        return super.sendTransaction.call(this, signedTransaction).catch(async (e) => {
            if (e.type === "NotEnoughBalance") {
                if (!this.reloadingPromise) {
                    this.reloadingPromise = SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId).finally(() => {
                        this.reloadingPromise = null;
                    });
                } 
                return this.reloadingPromise.then(() => {
                    if (getWorkerAccountRegex(TEST_WORKER_INDEX).test(signedTransaction.transaction.signerId)) {
                        process.env.workerBankStartBalance = new BN(process.env.workerBankStartBalance)
                            .add(new BN(parseNearAmount("200")))
                            .toString();
                    }
                    return super.sendTransaction.call(this, signedTransaction);
                });
            }
            throw e;
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
