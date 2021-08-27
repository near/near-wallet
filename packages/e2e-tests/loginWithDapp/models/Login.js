const { getDefaultConfig } = require("../../utils/account");
const { testDappURL } = require("../../utils/config");

class LoginPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(testDappURL);

        if (await this.page.$("data-test-id=testDapp-signOutBtn")) {
            await this.page.click("data-test-id=testDapp-signOutBtn");
            await this.page.waitForSelector("data-test-id=testDapp-signInBtn");
        }

        await this.page.click("data-test-id=testDapp-signInBtn");
        await this.page.waitForURL(/\/login/);
    }
    async allowAccess() {
        await this.page.click(`button:text-matches('allow', 'i')`);
    }
    async denyAccess() {
        await this.page.click(`button:text-matches('deny', 'i')`);
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

module.exports = { LoginPage };
