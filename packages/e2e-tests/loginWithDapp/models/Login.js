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
    async allowAccess() {
        await this.page.click(`data-test-id=allowNonFullAccessButton`);
    }
    async denyAccess() {
        await this.page.click(`data-test-id=denyAccessButton`);
    }
}

module.exports = { LoginPage };
