const { WALLET_NETWORK } = require("../../constants");
const nearApiJsConnection = require("../../utils/connectionSingleton");

class CreateAccountPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/create`);
    }
    async acceptTerms() {
        if (nearApiJsConnection.config.networkId === WALLET_NETWORK.MAINNET) {
            await this.page.click("data-test-id=acceptTermsButton");
        }
    }
    async submitAccountId(accountId) {
        await this.page.fill("data-test-id=createAccount.accountIdInput", accountId);
        await this.page.click(`data-test-id=reserveAccountIdButton`);
    }
}

module.exports = { CreateAccountPage };
