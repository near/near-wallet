class SetupSeedPhrasePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(`/setup-seed-phrase/${accountId}/phrase`);
    }
    async copySeedPhrase() {
        await this.page.click(`data-test-id=copySeedPhraseButton`);
        return this.page.evaluate(() => navigator.clipboard.readText());
    }
    async continueToSeedPhraseVerification() {
        await this.page.click(`data-test-id=continueToSeedPhraseVerificationButton`);
    }
}
module.exports = { SetupSeedPhrasePage };
