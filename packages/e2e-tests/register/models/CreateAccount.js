class CreateAccountPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/create`);
    }
    async acceptTerms() {
        const acceptTermsButtonSelector = "data-test-id=acceptTermsButton";
        if (await this.page.$(acceptTermsButtonSelector)) {
            await this.page.click(acceptTermsButtonSelector);
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