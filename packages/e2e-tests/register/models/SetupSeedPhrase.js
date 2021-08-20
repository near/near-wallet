class SetupSeedPhrasePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(`/setup-seed-phrase/${accountId}/phrase`);
    }
    async copySeedPhrase() {
        await this.page.click(`button:text-matches("Copy Phrase", "i")`);
        return this.page.evaluate(() => navigator.clipboard.readText());
    }
    async continueToSeedPhraseVerification() {
        await this.page.click(`button:text-matches("Continue", "i")`);
    }
}
module.exports = { SetupSeedPhrasePage };
