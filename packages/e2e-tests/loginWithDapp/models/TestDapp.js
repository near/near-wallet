const { testDappURL } = require("../../utils/config");

class TestDappPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(testDappURL);
    }
    async clickSignIn() {
        await this.page.click("data-test-id=testDapp-signInBtn");
    }
    async clickSignInWithFAK() {
        await this.page.click("data-test-id=testDapp-signInWithFAKBtn");
    }
    async getAccessKeyForAccountId(accountId) {
        return this.page.evaluate(
            (accountId) =>
                Object.keys(window.localStorage).find((k) =>
                    new RegExp(accountId).test(k)
                ),
            accountId
        );
    }
    async getPendingAccessKeys() {
        return this.page.evaluate(() =>
            Object.keys(window.localStorage).filter((k) =>
                /pending_key/.test(k)
            )
        );
    }
}

module.exports = { TestDappPage };
