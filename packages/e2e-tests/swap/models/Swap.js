const {
    AMOUNT_LOADING_DELAY,
    TOKENS_LOADING_DELAY,
} = require("../constants");

class SwapPage {
    constructor(page) {
        this.page = page;
    }

    async wait(ms) {
        await this.page.waitForTimeout(ms);
    }

    async close() {
        await this.page.close();
    }

    async navigate() {
        await this.page.goto('/swap');
    }

    async selectInputAsset(contractName) {
        await this.page.click('data-test-id=swapPageInputTokenSelector');
        await this.page.click(
            `data-test-id=token-selection-${contractName}`
        );
    }

    async selectOutputAsset(contractName) {
        await this.page.click('data-test-id=swapPageOutputTokenSelector');
        await this.page.click(
            `data-test-id=token-selection-${contractName}`
        );
    }

    async typeInputAmount(amount) {
        await this.page.fill(
            'data-test-id=swapPageInputAmountField',
            amount.toString()
        );
    }

    async getOutputInput() {
        return this.page.waitForSelector('data-test-id=swapPageOutputAmountField');
    }

    async clickOnPreviewButton() {
        await this.page.click('data-test-id=swapPageSwapPreviewStateButton');
    }

    async clickOnContinueAfterSwapButton() {
        await this.page.click('data-test-id=swapPageContinueAfterSwapButton');
    }

    async confirmSwap() {
        await this.page.click('data-test-id=swapPageStartSwapButton');
    }

    async waitResultMessageElement() {
        return this.page.waitForSelector('data-test-id=swapPageSuccessMessage')
    }

    async fillForm({ inId, inAmount, outId, initialDelay = TOKENS_LOADING_DELAY }) {
        await this.wait(initialDelay);
        await this.selectInputAsset(inId);
        await this.selectOutputAsset(outId);
        await this.typeInputAmount(inAmount);
        await this.wait(AMOUNT_LOADING_DELAY);
    }
}

module.exports = { SwapPage };
