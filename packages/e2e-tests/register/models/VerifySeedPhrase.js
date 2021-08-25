class VerifySeedPhrasePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(accountId) {
        await this.page.goto(`/setup-seed-phrase/${accountId}/phrase/verify`);
    }
    async getRequestedVerificationWordNumber() {
        const wordNumberTextContent = await this.page.textContent(
            "data-test-id=seedPhraseVerificationWordNumber"
        );
        return parseInt(wordNumberTextContent.slice(6));
    }
    async verifyWithWord(word) {
        await this.page.fill(
            "data-test-id=seedPhraseVerificationWordInput",
            word
        );
        await this.page.click("data-test-id=seedPhraseVerificationWordSubmit");
        await this.page.waitForNavigation();
    }
}
module.exports = { VerifySeedPhrasePage };
