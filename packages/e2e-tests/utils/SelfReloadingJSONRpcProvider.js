const { JsonRpcProvider } = require("near-api-js/lib/providers");
const { BN } = require("bn.js");

const { createAccountWithHelper } = require("../services/contractHelper");
const E2eTestAccount = require("./E2eTestAccount");
const { generateTestAccountId } = require("./helpers");
const nearApiJsConnection = require("./connectionSingleton");
const { getBankAccount } = require("./account");

class SelfReloadingJSONRpcProvider extends JsonRpcProvider {
    constructor(...args) {
        super(...args);
        this.isReloading = false;
    }
    sendTransaction(signedTransaction) {
        return super.sendTransaction.call(this, signedTransaction).catch(async (e) => {
            if (e.type === "NotEnoughBalance" && !this.isReloading) {
                this.isReloading = true;
                const { total: bankBalanceBeforeReload } = await getBankAccount().then((acc) => acc.getUpdatedBalance());
                await SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId);
                const { total: bankBalanceAfterReload } = await getBankAccount().then((acc) => acc.getUpdatedBalance());
                const reloadedAmount = new BN(bankBalanceAfterReload).sub(new BN(bankBalanceBeforeReload));
                if (signedTransaction.transaction.signerId === process.env.BANK_ACCOUNT) {
                    process.env.bankStartBalance = new BN(process.env.bankStartBalance).add(reloadedAmount).toString();
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
        const randomSubaccountSeedphrase = `${randomSubaccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
        await createAccountWithHelper(randomSubaccountId, randomSubaccountSeedphrase);
        const randomAccount = await new E2eTestAccount(randomSubaccountId, randomSubaccountSeedphrase, {
            accountId: nearApiJsConnection.config.networkId,
        }).initialize();
        return randomAccount.nearApiJsAccount.deleteAccount(accountId);
    }
}

module.exports = SelfReloadingJSONRpcProvider;
