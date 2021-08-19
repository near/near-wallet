class SetRecoveryOptionPage {
    recoveryOptions = {
        ledger: "ledger",
        email: "email",
        phone: "phone",
        seedPhrase: "phrase",
    };
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(`/set-recovery/${accountId}`);
    }
    // optionName is option prop in code (currently /phrase|ledger|email|phone/)
    getLedgerSelector() {
        return `data-test-id=recoveryOption.${this.recoveryOptions.ledger}`;
    }
    getEmailSelector() {
        return `data-test-id=recoveryOption.${this.recoveryOptions.email}`;
    }
    getPhoneSelector() {
        return `data-test-id=recoveryOption.${this.recoveryOptions.phone}`;
    }
    getSeedPhraseSelector() {
        return `data-test-id=recoveryOption.${this.recoveryOptions.seedPhrase}`;
    }
    async clickLedgerRecoveryOption() {
        return await this.page.click(this.getLedgerSelector());
    }
    async clickEmailRecoveryOption() {
        return await this.page.click(this.getEmailSelector());
    }
    async clickPhoneRecoveryOption() {
        return await this.page.click(this.getPhoneSelector());
    }
    async clickSeedPhraseRecoveryOption() {
        return await this.page.click(this.getSeedPhraseSelector());
    }
    async getLedgerRecoveryOptionElementHandle() {
        return await this.page.$(this.getLedgerSelector());
    }
    async getEmailRecoveryOptionElementHandle() {
        return await this.page.$(this.getEmailSelector());
    }
    async getPhoneRecoveryElementHandle() {
        return await this.page.$(this.getPhoneSelector());
    }
    async getSeedPhraseRecoveryElementHandle() {
        return await this.page.$(this.getSeedPhraseSelector());
    }
    async submitRecoveryOption() {
        await this.page.click(`[type="submit"]`);
    }
}
module.exports = { SetRecoveryOptionPage };
