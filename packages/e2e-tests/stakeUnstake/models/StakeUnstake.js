const BN = require("bn.js");
const { parseNearAmount } = require("near-api-js/lib/utils/format");

class StakeUnstakePage {
    constructor(page) {
        this.page = page;
    }
    async navigate() {
        await this.page.goto("/staking");
    }
    async clickStakeButton() {
        await this.page.click("data-test-id=stakeMyTokensButton");
    }
    async searhForValidator(searchText) {
        await this.page.fill("data-test-id=stakingSearchForValidator", searchText);
    }
    async getValidatorName(validatorIndex = 0) {
        return this.page.textContent(`data-test-id=stakingPageValidatorItemName >> nth=${validatorIndex}`);
    }
    async stakeWithValidator(validatorIndex = 0) {
        await this.page.click(`data-test-id=stakingPageSelectValidator >> nth=${validatorIndex}`);
    }
    async getNumberOfSelectableValidators() {
        return this.page.locator(`data-test-id=stakingPageSelectValidator`).count();
    }
    async getCurrentlyDisplayedBalance() {
        const balanceString = await this.page.textContent("data-test-id=accountSelectAvailableBalance");
        return new BN(parseNearAmount(balanceString.split(" ")[0]));
    }
    async clickStakeWithValidator() {
        await this.page.click("data-test-id=validatorPageStakeButton");
    }
    async submitStake() {
        await this.page.click("data-test-id=submitStakeButton");
    }
    async submitStakeWithAmount(amount) {
        await this.page.fill("data-test-id=stakingAmountInput", amount.toString());
        await this.submitStake();
    }
    async confirmStakeOnModal() {
        await this.page.click("data-test-id=confirmStakeOnModalButton");
    }
    async returnToDashboard() {
        await this.page.click("data-test-id=returnToDashboardButton");
    }
    async runStakingFlowWithAmount(amount, validatorIndex = 0) {
        await this.stakeWithValidator(validatorIndex);
        await this.clickStakeWithValidator();
        await this.submitStakeWithAmount(amount);
        await this.confirmStakeOnModal();
        await this.returnToDashboard();
    }
    async clickUnstakeButton() {
        await this.page.click("data-test-id=stakingPageUnstakingButton");
    }
    async submitStakeWithMaxAmount() {
        await this.page.click("data-test-id=stakingPageUseMaxButton");
        const submittedAmount = await this.page.inputValue("data-test-id=stakingAmountInput");
        await this.submitStake();
        return parseFloat(submittedAmount);
    }
    async clickValidatorItem(validatorItemIndex = 0) {
        await this.page.click(`data-test-id=stakingPageValidatorItem >> nth=${validatorItemIndex}`);
    }
}

module.exports = { StakeUnstakePage };
