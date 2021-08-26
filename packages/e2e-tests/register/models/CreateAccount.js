class CreateAccountPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/create`);
    }
    async acceptTerms() {
        if (process.env.WALLET_NETWORK === "mainnet") {
            await this.page.click("data-test-id=acceptTermsButton");
        }
    }
    async submitAccountId(accountId) {
        await this.page.fill(
            "data-test-id=createAccount.accountIdInput",
            accountId
        );
        await this.page.click(`data-test-id=reserveAccountIdButton`);
    }
}

module.exports = { CreateAccountPage };