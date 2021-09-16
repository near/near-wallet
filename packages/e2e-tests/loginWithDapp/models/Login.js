const { TestDappPage } = require("./TestDapp");

class LoginPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        const testDapp = new TestDappPage(this.page);
        await testDapp.navigate();
        await testDapp.clickSignIn();
        await this.page.waitForURL(/\/login/);
        return testDapp;
    }
    async navigateToFAKFlow() {
        const testDapp = new TestDappPage(this.page);
        await testDapp.navigate();
        await testDapp.clickSignInWithFAK();
        await this.page.waitForURL(/\/login/);
        return testDapp;
    }
    async allowAccess() {
        await this.page.click(`data-test-id=allowNonFullAccessButton`);
        await this.page.waitForNavigation();
    }
    async allowFullAccess() {
        await this.page.click(`data-test-id=allowFullAccessButton`);
    }
    async denyAccess() {
        await this.page.click(`data-test-id=denyAccessButton`);
    }
    async confirmAccountId(accountId) {
        await this.page.fill(
            `data-test-id=FAKRequestAccountIdConfirmationInput`,
            accountId
        );
        await this.page.click(`data-test-id=FAKRequestConfirmAccountIdButton`);
        await this.page.waitForNavigation();
    }
}

module.exports = { LoginPage };
