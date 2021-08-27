class HomePage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/`);
    }
    async clickCreateAccount() {
        await this.page.click(`data-test-id=landingPageCreateAccount`);
    }
}
module.exports = { HomePage };
