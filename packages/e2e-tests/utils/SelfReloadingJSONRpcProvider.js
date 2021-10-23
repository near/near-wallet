const { JsonRpcProvider } = require("near-api-js/lib/providers");
const { createAccountWithHelper } = require("../services/contractHelper");

const { E2eTestAccount } = require("./account");

class SelfReloadingJSONRpcProvider extends JsonRpcProvider {
    sendTransaction(signedTransaction) {
        return super.sendTransaction.call(this, signedTransaction).catch(async (e) => {
            if (e.type === "NotEnoughBalance") {
                await SelfReloadingJSONRpcProvider.reloadAccount(signedTransaction.transaction.signerId);
                return super.sendTransaction.call(this, signedTransaction);
            }
            throw e;
        });
    }
    static async reloadAccount(accountId) {
        const randomSubaccountId = `${generateTestAccountId()}.${nearApiJsConnection.config.networkId}`;
        const randomSubaccountSeedphrase = `${randomSubaccountId} ${process.env.TEST_ACCOUNT_SEED_PHRASE}`;
        await createAccountWithHelper(randomSubaccountId, randomSubaccountSeedphrase);
        const randomAccount = await new E2eTestAccount(randomSubaccountId, randomSubaccountSeedphrase, {
            accountId: nearApiJsConnection.config.networkId,
        }).initialize();
        await randomAccount.nearApiJsAccount.deleteAccount(accountId);
    }
}

module.exports = SelfReloadingJSONRpcProvider;
