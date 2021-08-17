class SetRecoveryOptionPage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(`/set-recovery/${accountId}`);
    }
    async selectRecoveryOption(searchText) {
        await this.page.click(`div :text-matches("${searchText}", "i")`);
    }
    async submitRecoveryOption(searchText) {
        await this.selectRecoveryOption(searchText);
        await this.page.click(`[type="submit"]`);
    }
    // optionName is option prop in code (currently /phrase|ledger|email|phone/)
    async getRecoveryOptionElementHandle(optionName) {
        return await this.page.$(`data-test-id=recoveryOption.${optionName}`);
    }
}
module.exports = { SetRecoveryOptionPage };
