class SendMoneyPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/send-money`);
    }
    async typeAmount(amount) {
        await this.page.fill(`data-test-id=sendMoneyAmountInput`, amount + "");
    }
    async typeAndSubmitAmount(amount) {
        await this.typeAmount(amount);
        await this.page.click('[type="submit"]');
    }
    async selectAsset(assetName) {
        await this.page.click(`div :text("Select Asset")`);
        await this.page.click(`data-test-id=token-selection-${assetName}`);
    }
    async typeAccountId(accountId) {
        await this.page.fill('[placeholder="Account ID"]', accountId);
    }
    async typeAndSubmitAccountId(accountId) {
        await this.page.fill('[placeholder="Account ID"]', accountId);
        await this.page.click('[type="submit"]');
    }
    async confirmTransaction() {
        await this.page.click('button:text-matches("Confirm & Send" , "i")');
    }
    async waitForTokenBalance() {
        // wait for the balance display to contain any character more than 0
        await this.page.waitForSelector(
            '[data-test-id=sendPageSelectedTokenBalance] >> div:text-matches("[1-9]")'
        );
    }
}
module.exports = { SendMoneyPage };
