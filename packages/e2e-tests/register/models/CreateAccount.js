class CreateAccountPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/create`);
    }
    async acceptTerms() {
        if (await this.page.$('button:text-matches("Agree & Continue", "i")')) {
            await this.page.click(
                'button:text-matches("Agree & Continue", "i")'
            );
        }
    }
    async submitAccountId(accountId) {
        await this.page.fill(
            "data-test-id=createAccount.accountIdInput",
            accountId
        );
        await this.page.click(`[type="submit"]`);
    }
}

module.exports = { CreateAccountPage };