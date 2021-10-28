const { JsonRpcProvider } = require("near-api-js/lib/providers");
const { BN } = require("bn.js");

const { createAccountWithHelper } = require("../services/contractHelper");
const E2eTestAccount = require("./E2eTestAccount");
const { generateTestAccountId, getWorkerAccountId } = require("./helpers");
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
                if (signedTransaction.transaction.signerId === getWorkerAccountId(process.env.TEST_WORKER_INDEX)) {
                    const bankAccount = await new E2eTestAccount(
                        signedTransaction.transaction.signerId,
                        getTestAccountSeedPhrase(signedTransaction.transaction.signerId)
                    ).initialize();
                    const { total: bankBalanceBeforeReload } = await bankAccount.getUpdatedBalance();
                    await SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId);
                    const { total: bankBalanceAfterReload } = await bankAccount.getUpdatedBalance();
                    const reloadedAmount = new BN(bankBalanceAfterReload).sub(new BN(bankBalanceBeforeReload));
                    process.env.workerBankStartBalance = new BN(process.env.workerBankStartBalance)
                        .add(reloadedAmount)
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
