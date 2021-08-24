class SendMoneyPage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto(`/send-money`);
    }
    async typeAmount(amount) {
        await this.page.fill(
            `data-test-id=sendMoneyAmountInput`,
            (amount && amount.toString()) || ""
        );
    }
    async typeAndSubmitAmount(amount) {
        await this.typeAmount(amount);
        await this.page.click("data-test-id=sendMoneyPageSubmitAmountButton");
    }
    async selectAsset(assetContractName) {
        await this.page.click(`data-test-id=sendMoneyPageSelectTokenButton`);
        await this.page.click(`data-test-id=token-selection-${assetContractName}`);
    }
    async typeAccountId(accountId) {
        await this.page.fill(
            "data-test-id=sendMoneyPageAccountIdInput",
            accountId
        );
    }
    async typeAndSubmitAccountId(accountId) {
        await this.typeAccountId(accountId);
        await this.page.click(
            "data-test-id=sendMoneyPageSubmitAccountIdButton"
        );
    }
    async confirmTransaction() {
        await this.page.click("data-test-id=sendMoneyPageConfirmButton");
    }
    async waitForTokenBalance() {
        // wait for the balance display to contain any character more than 0
        await this.page.waitForSelector(
            '[data-test-id=sendPageSelectedTokenBalance] >> div:text-matches("[1-9]")'
        );
    }
}
module.exports = { SendMoneyPage };
