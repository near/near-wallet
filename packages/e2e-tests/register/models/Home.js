class HomePage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/`);
    }
    async clickCreateAccount() {
        await this.page.click(`button:text-matches("create account","i")`);
    }
}
module.exports = { HomePage };
